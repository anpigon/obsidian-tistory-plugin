import { requestUrl, RequestUrlResponse } from 'obsidian';
import {
  GetTistoryBlogs,
  GetTistoryPosts,
  GetTistoryResponse,
  PostDetail,
  UpdatePostParams,
  Tistory,
  UpdatePostResponse,
  UploadAttachResponse,
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
  async writePost(params: Omit<UpdatePostParams, 'postId'>) {
    return await this.uploadPost('write', params);
  }

  /** 글 수정 API
   * @ref https://tistory.github.io/document-tistory-apis/apis/v1/post/write.html
   * @returns
   */
  async modifyPost(params: UpdatePostParams) {
    return await this.uploadPost('modify', params);
  }

  createFormData(params: UpdatePostParams) {
    const formData = new FormData();
    formData.append('blogName', params.blogName);
    formData.append('title', params.title);
    formData.append('category', params.category ?? '0');
    formData.append('visibility', params.visibility ?? '0');
    formData.append('acceptComment', params.acceptComment ?? '1');
    if (params.content) formData.append('content', params.content);
    if (params.published) formData.append('published', params.published);
    if (params.slogan) formData.append('slogan', params.slogan);
    if (params.tag) formData.append('tag', params.tag);
    if (params.password) formData.append('password', params.password);
    if (params.postId) formData.append('postId', params.postId);
    return formData;
  }

  async uploadPost(type: 'write' | 'modify', params: UpdatePostParams) {
    return fetch(this.getAuthenticatedUrl(`/post/${type}`), {
      method: 'post',
      body: this.createFormData(params),
    }).then(this.handleResponse<never, UpdatePostResponse>);
  }

  /** 파일 첨부 API
   * @ref https://tistory.github.io/document-tistory-apis/apis/v1/post/attach.html
   * @returns
   */
  async uploadFile(blogName: string, fileBlob: Blob, fileName?: string) {
    const formData = new FormData();
    formData.append('blogName', blogName);
    formData.append('uploadedfile', fileBlob, fileName);
    const url = this.getAuthenticatedUrl('/post/attach');
    return fetch(url, {
      method: 'post',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(this.handleResponse<never, UploadAttachResponse>);
  }
}
