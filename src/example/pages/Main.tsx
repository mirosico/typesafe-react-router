import { Link } from '../appRouter.ts';

export const Main = () => {
    return (
        <div>
            <div>
                <Link
                    to="/users/:userId/test/:testId"
                    params={{
                        userId: '123',
                        testId: 'test123',
                    }}
                >
                    Go to User id '123' and test id 'test123'
                </Link>
            </div>
            <div>
                <Link to={'/about'}>Go to About page</Link>
            </div>
            <div>This is main page</div>
        </div>
    );
};
