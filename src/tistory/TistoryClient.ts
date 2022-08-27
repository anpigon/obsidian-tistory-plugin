import { requestUrl, RequestUrlResponse } from 'obsidian';
import {
  GetTistoryBlogs,
  GetTistoryPosts,
  GetTistoryResponse,
  PostDetail,
  PostParams,
  Tistory,
  WritePostResponse,
} from './types';
import TistoryError from './TistoryError';

export default class TistoryClient {
  private readonly API_BASE = 'https://www.tistory.com/apis';

  constructor(private readonly accessToken: string) {}

  getAuthenticatedUrl(uri: string, param?: Record<string, unknown>) {
    const url = new URL(this.API_BASE + uri);
    url.searchParams.append('access_token', this.accessToken);
    url.searchParams.append('output', 'json');
    if (param) {
      Object.entries(param).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }

  async handleResponse<I, T extends Partial<Tistory<I>>>(response: RequestUrlResponse | Response) {
    const json =
      response.json instanceof Function ? await response.json() : (response.json as GetTistoryResponse<Tistory<I>>);
    if (response.status === 200 && json?.tistory?.status === '200' && json.tistory) {
      return json.tistory as T;
    }

    const errorCode = json.tistory.status ?? response.status;
    const errorMessage = json.tistory.error_message ?? response.text;
    throw new TistoryError(errorCode, errorMessage);
  }

  async get<I>(uri: string, param?: Record<string, unknown>) {
    const url = this.getAuthenticatedUrl(uri, param);
    const response = await requestUrl({
      url,
      contentType: 'application/json; charset=utf-8',
    });
    return await this.handleResponse<I, Tistory<I>>(response);
  }

  /**
   * 블로그 정보 API
   * @ref https://tistory.github.io/document-tistory-apis/apis/v1/blog/list.html
   * @returns
   */
  async getBlogs() {
    // return fetch(this.getAuthenticatedUrl('/blog/info')).then(res => res.json() as Promise<GetTistoryBlogs>);
    const { item } = await this.get<GetTistoryBlogs>('/blog/info');
    return item;
  }

  async getCategories(blogName: string) {
    const { item } = await this.get<GetTistoryBlogs>('/category/list', { blogName });
    return item;
  }

  /**
   * 글 목록 API
   * @ref https://tistory.github.io/document-tistory-apis/apis/v1/post/list.html
   * @param blogName 블로그명(블로그를 구분하는 식별자, 티스토리 주소 xxx.tistory.com에서 xxx를 나타낸다)
   * @param page 불러올 페이지 번호
   * @returns
   */
  async getPosts(blogName: string, page = 1) {
    const { item } = await this.get<GetTistoryPosts>('/post/list', {
      blogName,
      page,
    });
    return item;
  }

  /**
   * 글 읽기 API
   * @ref https://tistory.github.io/document-tistory-apis/apis/v1/post/read.html
   * @returns
   */
  async getPost(blogName: string, postId: string) {
    const { item } = await this.get<PostDetail>('/post/read', {
      blogName,
      postId,
    });
    return item;
  }

  /** 글 작성 API
   * @ref https://tistory.github.io/document-tistory-apis/apis/v1/post/write.html
   * @returns
   */
  async writePost(params: Omit<PostParams, 'postId'>) {
    return await this.uploadPost('/post/write', params);
  }

  /** 글 수정 API
   * @ref https://tistory.github.io/document-tistory-apis/apis/v1/post/write.html
   * @returns
   */
  async modifyPost(params: PostParams) {
    return await this.uploadPost('/post/modify', params);
  }

  async uploadPost(path: string, params: PostParams) {
    const {
      blogName,
      title,
      content,
      visibility = '0',
      category = '0',
      published,
      slogan,
      tag,
      acceptComment = '1',
      password,
      postId,
    } = params;

    const formData = new FormData();
    formData.append('blogName', blogName);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('visibility', visibility);
    formData.append('acceptComment', acceptComment);
    if (content) formData.append('content', content);
    if (published) formData.append('published', published);
    if (slogan) formData.append('slogan', slogan);
    if (tag) formData.append('tag', tag);
    if (password) formData.append('password', password);
    if (postId) formData.append('postId', postId);

    const url = this.getAuthenticatedUrl(path);
    const response = await fetch(url, {
      method: 'post',
      body: formData,
    });
    return await this.handleResponse<never, WritePostResponse>(response);
  }
}
