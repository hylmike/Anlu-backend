import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { BlogSchema } from '../schemas/blog.schema';
import {
  closeMongodConnection,
  mongooseTestModule,
} from '../schemas/test/mongo.test.module';
import { logger } from '../../test/util/winston';
import { BlogDto } from './blog.dto';
import { Blog } from './blog.interface';
import { BlogService } from './blog.service';
import { blogStub, blogData } from './test/stubs/blog.stub';

describe('BlogService', () => {
  let blogService: BlogService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        mongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
      ],
      providers: [
        BlogService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    blogService = module.get<BlogService>(BlogService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(blogService).toBeDefined();
  });

  describe('createBlog', () => {
    describe('when createBlog is called', () => {
      let blogDto1: BlogDto, blogDto2: BlogDto;
      let blog: Blog;

      beforeEach(async () => {
        blogDto1 = {
          topic: blogStub().topic,
          category: blogStub().category,
          author: blogStub().author,
          content: blogStub().content,
          keyword: blogStub().keyword,
        };
        blogDto2 = {
          topic: '',
          category: blogStub().category,
          author: blogStub().author,
          content: blogStub().content,
          keyword: blogStub().keyword,
        };
      });

      test('it should return new created blog', async () => {
        blog = await blogService.createBlog(blogDto1);
        expect(blog.topic).toEqual(blogStub().topic);
        expect(blog.createTime).not.toEqual(blogStub().createTime);
        blogData._id = blog._id;
      });

      test('it should return null for empty topic blog', async () => {
        blog = await blogService.createBlog(blogDto2);
        expect(blog).toBeNull;
      });
    });
  });

  describe('getBlog', () => {
    describe('when getBlog is called', () => {
      let blog: Blog;

      test('it should return valid blog', async () => {
        blog = await blogService.getBlog(blogStub()._id);
        expect(blog.topic).toEqual(blogStub().topic);
      });

      test('it should return null for non-exist blog id', async () => {
        blog = await blogService.getBlog('111111111111111111111111');
        expect(blog).toEqual(null);
      });
    });
  });

  describe('getBlogList', () => {
    describe('when getBlogList is called', () => {
      let blogList: Blog[];
      const num = 1;
      const newTopic = 'The latest news';
      const blogDto: BlogDto = {
        topic: newTopic,
        category: blogStub().category,
        author: 'Adam',
        content: 'The another latest news is ...',
        keyword: 'latest news',
      };

      test('it should return latest blogs', async () => {
        await blogService.createBlog(blogDto);
        blogList = await blogService.getBlogList(num);
        expect(blogList[0].topic).toEqual(newTopic);
      });

      test('it should return blog list based on request length', async () => {
        blogList = await blogService.getBlogList(num + 1);
        expect(blogList.length).toEqual(num + 1);
      });
    });
  });

  describe('updateBlog', () => {
    describe('when updateBlog is called', () => {
      let blogID: string;
      let blogDto: BlogDto;
      const newContent = 'The new content is ...';
      const newKeyword = 'New Key Word';

      beforeEach(async () => {
        blogDto = {
          topic: '',
          category: '',
          author: '',
          content: newContent,
          keyword: newKeyword,
        };
        blogID = await blogService.updateBlog(blogStub()._id, blogDto);
      });

      test('it should updated fields based on inputs', async () => {
        const blog = await blogService.getBlog(blogStub()._id);
        expect(blog.content).toEqual(newContent);
        expect(blog.keyword).toEqual(newKeyword);
      });

      test('it should return updated blog id', async () => {
        expect(blogID).toEqual(blogStub()._id);
      });
    });
  });

  describe('delBlog', () => {
    describe('when delBlog is called', () => {
      let blogID: string;

      test('it should return deleted blog id', async () => {
        blogID = await blogService.delBlog(blogStub()._id);
        expect(blogID).toEqual(blogStub()._id);
      });
    });
  });

  afterAll(async () => {
    closeMongodConnection();
    jest.clearAllMocks();
  });
});
