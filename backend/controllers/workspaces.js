const uuid = require('node-uuid');

const { DOMAIN_URL } = process.env;
const { Workspace, UserWorkspaces, User } = require('../models');
const mailer = require('../services/mailer');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const { id: userId } = req.user;

    const workspace = await Workspace.create({ name, userId });

    const user = await User.findById(userId);

    await user.addWorkspace(workspace);

    await user.updateAttributes({ isActivated: true });

    return res.status(200).json({ workspace });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.findById = async (req, res) => {
  try {
    const { id } = req.params;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json();
    }

    return res.status(200).json({ workspace });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.findAll = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const workspaces = await user.getWorkspaces({ through: { where: { status: true } } });

    return res.status(200).json({ workspaces });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllMembersByWorkspaceId = async (req, res) => {
  try {
    const { id } = req.params;

    const workspace = await Workspace.findById(id);

    const members = await workspace.getMembers({ joinTableAttributes: [] });

    return res.status(200).json({ members });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id: workspaceId } = req.params;
    const { id: userId } = req.user;

    await UserWorkspaces.destroy({ where: { workspaceId } });
    await Workspace.destroy({ where: { id: workspaceId } });

    const workspaces = await Workspace.findAll();

    const user = await User.findById(userId);

    if (workspaces.length === 0) {
      await user.updateAttributes({ isActivated: false });
    }

    return res.status(200).json();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.invite = async (req, res) => {
  try {
    const { workspaceId, email } = req.body;

    const user = await User.find({ where: { email } });

    const { code } = user
      ? await UserWorkspaces.create({
        workspaceId, status: false, userId: user.id, code: uuid(),
      })
      : await UserWorkspaces.create({
        workspaceId, email, status: false, code: uuid(),
      });

    const url = `${DOMAIN_URL}/dashboard/workspace/${workspaceId}/accept/${code}/`;

    await mailer({
      to: email,
      from: 'support@taska.space',
      subject: 'You\'ve been invited to team',
      html: `<a href="${url}">${url}</a>`,
    });

    return res.status(200).json({ workspaceId, email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.accept = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { code } = req.body;
    const { id: workspaceId } = req.params;

    await UserWorkspaces.update({ status: true, userId }, { where: { code } });

    const workspace = await Workspace.findById(workspaceId);

    return res.status(200).json({ workspace });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
