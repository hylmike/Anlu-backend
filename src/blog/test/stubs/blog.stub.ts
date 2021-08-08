import { Blog } from '../../blog.interface';

export const blogData: Blog = {
  _id: '60ec4c55aaa6bb29cd893e9e',
  topic: 'blog Sample',
  category: 'Our library monthly meeting',
  author: 'Johnthan',
  content: 'The latest new is ...',
  createTime: new Date('2020-07-20T00:00:00Z'),
  keyword: 'meeting, monthly',
};

export const blogStub = (): Blog => {
  return blogData;
};
