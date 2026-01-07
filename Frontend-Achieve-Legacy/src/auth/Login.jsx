import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import logo1 from '../assets/logo1.png'; 
import '../styles/Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      console.log('Login API Response:', response);

      if (!response.id) {
        console.error('No user ID in response:', response);
        throw new Error('User ID not found in login response');
      }

      const userData = {
        id: response.id,
        email: response.email,
        fullName: response.fullName,
        role: response.role
      };

      console.log('Processed user data:', userData);

      // Store the user data in localStorage as a backup
      localStorage.setItem('user', JSON.stringify(userData));
      
      authLogin(userData, response.token);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Row className="justify-content-center w-100">
          <Col md={6} lg={5}>
            <Card className="shadow-lg bg-glass">
              <Card.Body className="p-5">
               
                <div className="text-center mb-3">
                <img 
                  src={logo1} 
                  alt="Achieve+" 
                  className="brand-logo" 
                  style={{ maxWidth: '120px', height: 'auto' }} 
                />
              </div>

                <h2 className="text-center mb-3">Welcome Back!</h2>
                <p className="text-center text-muted">Enter your credentials to access your account</p>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <div className="d-flex justify-content-between">
                      <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
                    </div>
                    <Form.Control 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <div className="d-grid mt-4">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="py-2"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : <><i className="bi bi-box-arrow-in-right me-2"></i> Login</>}
                    </Button>
                  </div>
                </Form>
                <div className="text-center mt-4">
                  <p>Don't have an account? <Link to="/signup" className="text-decoration-none">Sign up</Link></p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;



































































































//for test
// import React, { useState } from 'react';
// import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { login } from '../api/auth';
// import { useAuth } from '../context/AuthContext';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login: authLogin } = useAuth();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await login({ email, password });
//       console.log('Login response:', response); // Debug the full response
      
//       // Make sure we're using the exact properties from the backend response
//       authLogin({
//         email: response.email,
//         fullName: response.fullName,
//         role: response.role // This should match exactly what comes from backend
//       }, response.token);
//     } catch (err) {
//       setError('Invalid credentials. Please try again.');
//       console.error('Login error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-center">
//         <Col md={6}>
//           <div className="text-center mb-4">
//             <span className="text-primary h2">🏆 Achieve+</span>
//           </div>
//           <Card className="shadow-sm">
//             <Card.Body className="p-4">
//               <h2 className="text-center mb-4">Welcome back</h2>
//               <p className="text-center text-muted mb-4">Enter your credentials to access your account</p>

//               {error && <Alert variant="danger">{error}</Alert>}

//               <Form onSubmit={handleLogin}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Email</Form.Label>
//                   <Form.Control 
//                     type="email" 
//                     placeholder="you@example.com" 
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Password</Form.Label>
//                   <div className="d-flex justify-content-between">
//                     <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
//                   </div>
//                   <Form.Control 
//                     type="password" 
//                     placeholder="••••••••" 
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//                 <div className="d-grid mt-4">
//                   <Button 
//                     variant="primary" 
//                     type="submit" 
//                     className="py-2"
//                     disabled={loading}
//                   >
//                     {loading ? 'Signing in...' : <><i className="bi bi-box-arrow-in-right me-2"></i> Sign in</>}
//                   </Button>
//                 </div>
//               </Form>
//               <div className="text-center mt-4">
//                 <p>Don't have an account? <Link to="/signup" className="text-decoration-none">Sign up</Link></p>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Login;


























































//for test
// import React, { useState } from 'react';
// import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { login } from '../api/auth';
// import { useAuth } from '../context/AuthContext';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login: authLogin } = useAuth();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await login({ email, password });
//       console.log('Login response:', response); // Debug the full response
      
//       // Make sure we're using the exact properties from the backend response
//       authLogin({
//         email: response.email,
//         fullName: response.fullName,
//         role: response.role // This should match exactly what comes from backend
//       }, response.token);
//     } catch (err) {
//       setError('Invalid credentials. Please try again.');
//       console.error('Login error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-center">
//         <Col md={6}>
//           <div className="text-center mb-4">
//             <span className="text-primary h2">🏆 Achieve+</span>
//           </div>
//           <Card className="shadow-sm">
//             <Card.Body className="p-4">
//               <h2 className="text-center mb-4">Welcome back</h2>
//               <p className="text-center text-muted mb-4">Enter your credentials to access your account</p>

//               {error && <Alert variant="danger">{error}</Alert>}

//               <Form onSubmit={handleLogin}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Email</Form.Label>
//                   <Form.Control 
//                     type="email" 
//                     placeholder="you@example.com" 
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Password</Form.Label>
//                   <div className="d-flex justify-content-between">
//                     <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
//                   </div>
//                   <Form.Control 
//                     type="password" 
//                     placeholder="••••••••" 
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//                 <div className="d-grid mt-4">
//                   <Button 
//                     variant="primary" 
//                     type="submit" 
//                     className="py-2"
//                     disabled={loading}
//                   >
//                     {loading ? 'Signing in...' : <><i className="bi bi-box-arrow-in-right me-2"></i> Sign in</>}
//                   </Button>
//                 </div>
//               </Form>
//               <div className="text-center mt-4">
//                 <p>Don't have an account? <Link to="/signup" className="text-decoration-none">Sign up</Link></p>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Login;