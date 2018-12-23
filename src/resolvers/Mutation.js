import jwt from 'jsonwebtoken';
import sha256 from 'sha256';

const Mutation = {
  signup: async(parent, args, context, info) => {
    const data = {
      ...args,
      password: sha256(args.password),
    };
    const user = await context.prisma.mutation.createUser({ data }, info);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    return { token, user };
  },
  signout: (parent, args, context, info) => (
    context.prisma.mutation.deleteUser({
      where: {
        id: context.currentUser.id,
      },
    }, info)
  ),
  addFriend: (parent, args, context, info) => (
    context.prisma.mutation.updateUser({
      where: { id: context.currentUser.id },
      data: { friends: { connect: { email: args.friendId } } },
    }, info)
  ),
  removeFriend: (parent, args, context, info) => (
    context.prisma.mutation.updateUser({
      where: { id: context.currentUser.id },
      data: { friends: { disconnect: { email: args.friendId } } },
    }, info)
  ),
};

export default Mutation;
