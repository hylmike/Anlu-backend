module.exports = {
  async up(db) {
    // TODO write your migration here.
    await db
      .collection('users')
      .updateMany({}, { $set: { currentBook: 'Beauty' } });
  },

  async down(db) {
    // TODO write the statements to rollback your migration (if possible)
    await db
      .collection('users')
      .updateMany({}, { $unset: { currentBook: null } });
  },
};
