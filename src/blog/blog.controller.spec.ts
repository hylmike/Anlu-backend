import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogDto } from './blog.dto';
import { Blog } from './blog.interface';
import { BlogService } from './blog.service';
import { blogStub } from './test/stubs/blog.stub';

jest.mock('./blog.service');

describe('BlogController', () => {
  let blogController: BlogController;
  let blogService: BlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [BlogService],
    }).compile();

    blogController = module.get<BlogController>(BlogController);
    blogService = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(blogController).toBeDefined();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let blog: Blog;
      let blogDto: BlogDto;

      beforeEach(async () => {
        blogDto = {
          topic: blogStub().topic,
          category: blogStub().category,
          creator: blogStub().creator,
          content: blogStub().content,
          keywords: blogStub().keywords,
        };
        blog = await blogController.create(blogDto);
      });

      test('it should call blogService', async () => {
        expect(blogService.createBlog).toHaveBeenCalledWith(blogDto);
      });

      test('it should return created blog', async () => {
        expect(blog).toEqual(blogStub());
      });
    });
  });

  describe('get', () => {
    describe('when get is called', () => {
      let blog: Blog;

      beforeEach(async () => {
        blog = await blogController.get(blogStub()._id);
      });

      test('it should call blogService', async () => {
        expect(blogService.getBlog).toHaveBeenCalledWith(blogStub()._id);
      });

      test('it should return a blog', async () => {
        expect(blog).toEqual(blogStub());
      });
    });
  });

  describe('getBlogList', () => {
    describe('when getBlogList is called', () => {
      let blogList: Blog[];
      const num = 1;

      beforeEach(async () => {
        blogList = await blogController.getBlogList(num);
      });

      test('it should call blogService', async () => {
        expect(blogService.getBlogList).toHaveBeenCalledWith(num);
      });

      test('it should return latest blog list', async () => {
        expect(blogList).toEqual([blogStub()]);
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let blog: Blog;
      let blogDto: BlogDto;

      beforeEach(async () => {
        blogDto = {
          topic: blogStub().topic,
          category: blogStub().category,
          creator: blogStub().creator,
          content: 'newContent',
          keywords: 'new keywords',
        };
        blog = await blogController.update(blogStub()._id, blogDto);
      });

      test('it should call blogService', async () => {
        expect(blogService.updateBlog).toHaveBeenCalledWith(
          blogStub()._id,
          blogDto,
        );
      });

      test('it should return updated blog', async () => {
        expect(blog._id).toEqual(blogStub()._id);
      });
    });
  });

  describe('delete', () => {
    describe('when delete is called', () => {
      let blogID: string;

      beforeEach(async () => {
        blogID = await blogController.delBlog(blogStub()._id);
      });

      test('it should call blogService', async () => {
        expect(blogService.delBlog).toHaveBeenCalledWith(blogStub()._id);
      });

      test('it should return deleted blog id', async () => {
        expect(blogID).toEqual(blogStub()._id);
      });
    });
  });
});
