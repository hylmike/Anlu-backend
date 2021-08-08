import { blogStub } from '../test/stubs/blog.stub';

export const BlogService = jest.fn().mockReturnValue({
  createBlog: jest.fn().mockResolvedValue(blogStub()),
  getBlog: jest.fn().mockResolvedValue(blogStub()),
  getBlogList: jest.fn().mockResolvedValue([blogStub()]),
  updateBlog: jest.fn().mockResolvedValue(blogStub()._id),
  delBlog: jest.fn().mockResolvedValue(blogStub()._id),
});
