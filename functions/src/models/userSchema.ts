import { S } from 'fluent-json-schema';

export const loginSchema = {
    body: S.object()
        .prop('email', S.string().format(S.FORMATS.EMAIL).required())
        .prop('password', S.string().minLength(8).required()),
    queryString: S.object(),
    params: S.object(),
    headers: S.object(),
};

export const signupSchema = {
    body: S.object()
        .prop('email', S.string().format(S.FORMATS.EMAIL).required())
        .prop('password', S.string().minLength(8).required())
        .prop('name', S.string().minLength(4).required()),
    queryString: S.object(),
    params: S.object(),
    headers: S.object(),
};

export const resetPasswordSchema = {
    body: S.object().prop('email', S.string().format(S.FORMATS.EMAIL).required()),
    queryString: S.object(),
    params: S.object(),
    headers: S.object(),
};
