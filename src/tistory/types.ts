export interface Tistory<I> {
  status: string;
  error_message?: string;
  item: I;
}

export interface GetTistoryResponse<T extends Tistory<unknown>> {
  tistory: T;
}

/** GetTistoryBlogsResponse */
export interface GetTistoryPosts {
  url: string;
  secondaryUrl: string;
  page: string;
  count: string;
  totalCount: string;
  posts: Post[];
}
export interface Post {
  id: string; // 글 ID
  title: string; // 글 제목
  postUrl: string; // 글 대표주소
  visibility: '0' | '1' | '3'; // 발행상태 (0: 비공개 - 기본값, 1: 보호, 3: 발행)
  categoryId: string; // 카테고리 ID
  comments: string; //  댓글 개수: "0"
  trackbacks: string; // "0"
  date: string; // 발행시간 timestamp: list(YYYY-mm-dd HH:MM:SS), detail("1303352668")
}

export interface PostDetail extends Post {
  url: string;
  secondaryUrl: string;
  content: string;
  acceptComment: '1' | '0'; // 댓글 허용 여부(허용: 1, 비허용: 0)
  acceptTrackback: '1' | '0'; // 트랙백 허용 여부(허용: 1, 비허용: 0)
  tags: {
    tag: string[]; // 태그
  };
}

export interface PostParams {
  blogName: string;
  postId?: string; // 글 번호 (수정 시 필수)
  title: string; // 글 제목 (필수)
  content?: string; // 글 내용
  visibility: '0' | '1' | '3'; // 발행상태 (0: 비공개 - 기본값, 1: 보호, 3: 발행)
  category?: string; // 카테고리 아이디 (기본값: 0)
  published?: string; // 발행시간 (TIMESTAMP 이며 미래의 시간을 넣을 경우 예약. 기본값: 현재시간)
  slogan?: string; // 문자 주소
  tag?: string; // 태그 (',' 로 구분)
  acceptComment?: string; // 댓글 허용 (0, 1 - 기본값)
  password?: string; // 보호글 비밀번호
}

export interface WritePostResponse extends Omit<Tistory<void>, 'item'> {
  postId: string;
  url: string;
}

export interface GetTistoryBlogs {
  url: string;
  secondaryUrl: string;
  categories: Category[];
}

export interface Category {
  id: string; // 카테고리 ID
  name: string; // 카테고리 이름
  parent: string; // 부모 카테고리 ID
  label: string; // 부모 카테고리를 포함한 전체 이름 ('/'로 구분)
  entries: string; // 카테고리내 글 수
}

/** GetTistoryBlogsResponse */
export interface GetTistoryBlogs {
  id: string;
  userId: string;
  blogs: Blog[];
}
export interface Blog {
  name: string;
  url: string;
  secondaryUrl: string;
  nickname: string;
  title: string;
  description: string;
  default: string;
  blogIconUrl: string;
  faviconUrl: string;
  profileThumbnailImageUrl: string;
  profileImageUrl: string;
  role: string;
  blogId: string;
  statistics: Statistics;
}

export interface Statistics {
  post: string;
  comment: string;
  trackback: string;
  guestbook: string;
  invitation: string;
}
