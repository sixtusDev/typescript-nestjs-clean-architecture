export type HttpUserProps = {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
};

export type HttpRequestWithUser = Request & { user: HttpUserProps };
