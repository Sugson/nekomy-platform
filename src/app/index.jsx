import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import ReactGA from 'react-ga';
import firebase from 'firebase';
import { ADMIN_LEVEL } from './core/constants/constants';
import store, { history } from './store';
import './bundle.scss';
import App from './core/app';
import Home from './themes/nekomy/pages/home/home';
import Dashboard from './themes/nekomy/pages/dashboard/dashboard';
import AccountSettings from './themes/nekomy/pages/account/settings';
import AccountNotifications from './themes/nekomy/pages/account/notifications';
import Listing from './themes/nekomy/pages/listing/listing';
import Page from './themes/nekomy/pages/page/page';
import Post from './themes/nekomy/pages/post/post';
import Course from './themes/nekomy/pages/course/course';
import Subject from './themes/nekomy/pages/subject/subject';
import Forum from './themes/nekomy/pages/forum/forum';
import Homework from './themes/nekomy/pages/homework/homework';
import Quiz from './themes/nekomy/pages/quiz/quiz';
import Module from './themes/nekomy/pages/module/module';
import Activity from './themes/nekomy/pages/activity/activity';
import NotFound from './themes/nekomy/pages/notFound/notFound';
import Admin from './core/admin/admin';

// Google Analytics initializacion
ReactGA.initialize('UA-00000000-1', {
  debug: false,
  titleCase: false,
  gaOptions: {}
});

function logPageView() {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.set({ page: window.location.href });
    ReactGA.pageview(window.location.href);
  }
}

function requireAuth(nextState, replace, callback) {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user || !user.emailVerified) {
      history.push('/');
    } else {
      let requiresLevel = 0;
      nextState.routes.map((route) => {
        if (route.level) {
          requiresLevel = route.level;
        }
        return false;
      });
      if (requiresLevel > 0) {
        firebase.database().ref(`/users/${user.uid}`).once('value').then((snapshot) => {
          if (!snapshot.val() || !snapshot.val().info.level || (snapshot.val().info.level < requiresLevel)) {
            history.push('/');
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    }
  });
}

// Router initialization
ReactDOM.render(
  <Provider store={store}>
    <Router
      onUpdate={() => {
        window.scrollTo(0, 0);
        logPageView();
      }} history={history}
    >
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="/dashboard" component={Dashboard} onEnter={requireAuth} />
        <Route path="/account" component={AccountSettings} onEnter={requireAuth} />
        <Route path="/account/notifications" component={AccountNotifications} onEnter={requireAuth} />
        <Route path="/courses" component={Listing} onEnter={requireAuth} />
        <Route path="/courses/:slug" component={Course} onEnter={requireAuth} />
        <Route path="/courses/:slug/register" component={Course} onEnter={requireAuth} />
        <Route path="/courses/:slug/subjects" component={Course} onEnter={requireAuth} />
        <Route path="/courses/:slug/fees" component={Course} onEnter={requireAuth} />
        <Route path="/courses/:slug/requirements" component={Course} onEnter={requireAuth} />
        <Route path="/subjects" component={Listing} onEnter={requireAuth} />
        <Route path="/subjects/:slug" component={Subject} onEnter={requireAuth} />
        <Route path="/subjects/:slug/forum" component={Forum} onEnter={requireAuth} />
        <Route path="/subjects/:slug/homework" component={Homework} onEnter={requireAuth} />
        <Route path="/subjects/:slug/quiz" component={Quiz} onEnter={requireAuth} />
        <Route path="/subjects/:slug/activities" component={Subject} onEnter={requireAuth} />
        <Route path="/modules" component={Listing} onEnter={requireAuth} />
        <Route path="/modules/:slug" component={Module} onEnter={requireAuth} />
        <Route path="/activities" component={Listing} onEnter={requireAuth} />
        <Route path="/activities/:slug" component={Activity} onEnter={requireAuth} />
        <Route path="/about" component={Page} />
        <Route path="/about/contact" component={Page} />
        <Route path="/admin" component={Admin} level={ADMIN_LEVEL} onEnter={requireAuth} />
        <Route path="/admin/:type/:action" component={Admin} level={ADMIN_LEVEL} onEnter={requireAuth} />
        <Route path="/admin/:type/:action/:slug" component={Admin} level={ADMIN_LEVEL} onEnter={requireAuth} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>, document.getElementById('react-root')
);
