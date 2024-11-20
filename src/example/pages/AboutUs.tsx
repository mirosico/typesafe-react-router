import { Link } from '../appRouter.ts';

export const AboutUs = () => {
    return (
        <div>
            <div>
                <Link
                    to="/users/:userId/test/:testId"
                    params={{ userId: '123', testId: 'test123' }}
                >
                    Go to User id '123' and test id 'test123'
                </Link>
            </div>
            <div>
                <Link to={'/'}>Go to main page</Link>
            </div>
            <div>This is page "About Us"</div>
        </div>
    );
};
