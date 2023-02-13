import React, { Suspense } from 'react';
import { useParams } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { SyncOutlined } from '@ant-design/icons';

const HomePage = React.lazy(() => import('./pages/home.page'));

const App = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <Suspense fallback={
            <div>
              <div className="container-fluid text-center" style={{ fontSize: '32px', position: 'absolute', top: '50%', right: '50%', transform: 'translate(50%,-50%)' }}>
              <b>Blue&nbsp;<SyncOutlined spin style={{ color: "blue", fontSize: '32px' }} />&nbsp;Bite</b>
              </div>
            </div>
          }>
        <div className="outer-most-container" style={{ backgroundColor: '#eeeeee' }}>
        <div style={{ display: 'none' }}>!Render {id}</div>
        <Switch>
            <Route path='/' component={HomePage} />
        </Switch>
        </div>
        </Suspense>
    );
};

export default App;
