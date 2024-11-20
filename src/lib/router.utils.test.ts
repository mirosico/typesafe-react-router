import { describe, expect, it } from 'vitest';
import {
    buildPath,
    extractParamNames,
    extractParams,
    extractParamValues,
    ExtractRouteParams,
    IsEmptyObject,
    matchPath,
} from './router.utils.ts';

const expectType = <T>(_: T): true => true;

describe('router utils types', () => {
    describe('ExtractRouteParams', () => {
        it('should extract route params', () => {
            type TestType = ExtractRouteParams<'/products/:productId'>;
            expectType<TestType>({ productId: '123' });
        });
    });

    describe('IsEmptyObject', () => {
        it('should verify IsEmptyObject type util', () => {
            type TestTypeIsEmptyObject = IsEmptyObject<{}>;
            expect(expectType<TestTypeIsEmptyObject>(true)).toBe(true);
        });
    });
});

describe('router utils', () => {
    describe('matchPath', () => {
        it('should return true when current path matches path pattern', () => {
            expect(matchPath('/user/:id', '/user/123')).toBe(true);
        });

        it('should return false when current path does not match path pattern', () => {
            expect(matchPath('/user/:id', '/user')).toBe(false);
        });
    });

    describe('extractParamNames', () => {
        it('should return param names from path pattern', () => {
            expect(extractParamNames('/user/:id')).toEqual(['id']);
        });

        it('should return empty array when path pattern does not have params', () => {
            expect(extractParamNames('/user')).toEqual([]);
        });
    });

    describe('extractParamValues', () => {
        it('should return param values from current path', () => {
            expect(extractParamValues('/user/:id', '/user/123')).toEqual([
                '123',
            ]);
        });

        it('should return empty array when current path does not have params', () => {
            expect(extractParamValues('/user/:id', '/user')).toEqual([]);
        });
    });

    describe('extractParams', () => {
        it('should return params from current path', () => {
            expect(extractParams('/user/:id', '/user/123')).toEqual({
                id: '123',
            });
        });

        it('should return empty object when current path does not have params', () => {
            expect(extractParams('/user/:id', '/user')).toEqual({});
        });

        it('should return multiple params from current path', () => {
            expect(
                extractParams(
                    '/user/:id/test/:testId',
                    '/user/123/test/test123',
                ),
            ).toEqual({ id: '123', testId: 'test123' });
        });
    });

    describe('buildPath', () => {
        it('should build path with params', () => {
            expect(buildPath('/user/:id', { id: '123' })).toBe('/user/123');
        });

        it('should build path with multiple params', () => {
            expect(
                buildPath('/user/:id/test/:testId', {
                    id: '123',
                    testId: 'test123',
                }),
            ).toBe('/user/123/test/test123');
        });

        it('should return path when params are empty', () => {
            expect(buildPath('/user/:id')).toBe('/user/:id');
        });
    });
});
