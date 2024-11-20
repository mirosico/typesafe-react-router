import React from 'react';
import { Link } from '../appRouter.ts';

interface UserPageProps {
    userId: string;
    testId: string;
}

export const User: React.FC<UserPageProps> = (props) => {
    return (
        <div>
            <div>
                <Link to="/about">Go to About page</Link>
            </div>
            <div>
                <Link to={'/'}>Go to main page</Link>
            </div>
            <div>
                This is user page User id: {props.userId} Test id:{' '}
                {props.testId}
            </div>
        </div>
    );
};
