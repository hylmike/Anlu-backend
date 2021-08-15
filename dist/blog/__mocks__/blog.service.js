"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const blog_stub_1 = require("../test/stubs/blog.stub");
exports.BlogService = jest.fn().mockReturnValue({
    createBlog: jest.fn().mockResolvedValue(blog_stub_1.blogStub()),
    getBlog: jest.fn().mockResolvedValue(blog_stub_1.blogStub()),
    getBlogList: jest.fn().mockResolvedValue([blog_stub_1.blogStub()]),
    updateBlog: jest.fn().mockResolvedValue(blog_stub_1.blogStub()._id),
    delBlog: jest.fn().mockResolvedValue(blog_stub_1.blogStub()._id),
});
//# sourceMappingURL=blog.service.js.map