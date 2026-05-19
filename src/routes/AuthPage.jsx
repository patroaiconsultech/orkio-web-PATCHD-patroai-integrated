// AO-14C — AuthPage.jsx integration snippet
// Path: src/routes/AuthPage.jsx
//
// Apply this surgically to your existing login success handler.
// Do NOT replace the whole file blindly.

import { consumeReturnTo, DEFAULT_AFTER_LOGIN_PATH } from "../lib/authReturn";

// Inside AuthPage component:
const location = useLocation();
const navigate = useNavigate();

// In the existing login success block, replace the hardcoded navigation
// that currently sends Admin to console/chat with:

const destination = consumeReturnTo(location) || DEFAULT_AFTER_LOGIN_PATH;
navigate(destination, { replace: true });

// If your project uses window.location instead of react-router navigate,
// use:
//
// const destination = consumeReturnTo(window.location) || DEFAULT_AFTER_LOGIN_PATH;
// window.location.assign(destination);
