import React, { useState, useEffect, useRef } from 'react';
import './LoginPage.css';
import { firebaseAuthService, type AuthUser } from '../services/firebaseAuth';

// 导入图片资源
import bytebaseLogo from '../assets/bytebase-logo.svg';
import googleIcon from '../assets/google.png';
import githubIcon from '../assets/github.png';
import microsoftIcon from '../assets/microsoft.png';

/**
 * Bytebase 登录页面组件
 * 支持多种登录方式：Google、GitHub、Microsoft Account 和邮箱登录
 * 响应式设计，适配桌面端和移动端
 */
const LoginPage: React.FC = () => {
  // 状态管理
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailLogin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailErrorType, setEmailErrorType] = useState<'empty' | 'invalid' | null>(null);
  const [isVerifyMode, setIsVerifyMode] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 监听认证状态变化
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (authUser) {
        console.log('用户已登录:', authUser);
        // 这里可以跳转到主页面或显示用户信息
      }
    });

    return () => unsubscribe();
  }, []);

  // 监听点击事件来隐藏错误提示
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emailError && containerRef.current && containerRef.current.contains(event.target as Node)) {
        setEmailError(null);
        setEmailErrorType(null);
      }
    };

    if (emailError) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emailError]);

  /**
   * 处理第三方登录
   * @param provider - 登录提供商 (google, github, microsoft)
   */
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`正在使用 ${provider} 登录...`);
      
      if (provider === 'GitHub') {
        const user = await firebaseAuthService.signInWithGitHub();
        console.log('GitHub 登录成功:', user);
      } else if (provider === 'Google') {
        const user = await firebaseAuthService.signInWithGoogle();
        console.log('Google 登录成功:', user);
      } else if (provider === 'Microsoft') {
        const user = await firebaseAuthService.signInWithMicrosoft();
        console.log('Microsoft 登录成功:', user);
      } else {
        // 其他第三方登录的模拟逻辑
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`${provider} 登录功能即将推出`);
      }
    } catch (error) {
      console.error(`${provider} 登录失败:`, error);
      const errorMessage = error instanceof Error ? error.message : `${provider} 登录失败，请重试`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理登出
   */
  const handleSignOut = async () => {
    try {
      await firebaseAuthService.signOut();
      console.log('用户已登出');
    } catch (error) {
      console.error('登出失败:', error);
      setError(error instanceof Error ? error.message : '登出失败');
    }
  };

  /**
   * 处理邮箱登录
   * @param e - 表单提交事件
   */
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('请填写邮箱和密码');
      return;
    }

    setIsLoading(true);
    try {
      // 模拟邮箱登录逻辑
      console.log('正在使用邮箱登录...', { email, rememberMe });
      // 这里应该调用实际的登录 API
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('邮箱登录成功！');
    } catch (error) {
      console.error('邮箱登录失败:', error);
      alert('登录失败，请检查邮箱和密码');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 验证电子邮件格式
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * 处理邮箱验证和继续操作
   */
  const toggleEmailLogin = () => {
    // 重置错误状态
    setEmailError(null);
    setEmailErrorType(null);
    
    // 检查邮箱是否为空
    if (!email.trim()) {
      setEmailError('填写此栏');
      setEmailErrorType('empty');
      return;
    }
    
    // 检查邮箱格式是否正确
    if (!isValidEmail(email)) {
      setEmailError(`请输入有效的电子邮件地址（例如：user@domain.com）。`);
      setEmailErrorType('invalid');
      return;
    }
    
    // 邮箱格式正确，显示验证页面
    setIsVerifyMode(true);
    // 这里可以模拟发送验证码的逻辑
    console.log(`已向 ${email} 发送验证码`);
  };

  return (
    <div className="login-container" ref={containerRef}>
      {/* 右侧登录表单区域 */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          {/* Bytebase Logo */}
          <div className="logo-section">
            <div className="logo">
              <img 
                src={bytebaseLogo} 
                alt="Bytebase Logo"
                className="logo-image"
              />
            </div>
          </div>

          {/* 欢迎文本 */}
          <div className="welcome-section">
            <h2 className="welcome-title">欢迎</h2>
            <p className="welcome-subtitle">
              登录 Bytebase 以继续使用 Bytebase Hub。
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button 
                className="error-close"
                onClick={() => setError(null)}
                aria-label="关闭错误提示"
              >
                ×
              </button>
            </div>
          )}

          {/* 用户状态显示 */}
          {user ? (
            <div className="user-profile-section">
              <div className="user-info">
                <div className="user-avatar">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="用户头像" className="avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : '👤'}
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <h3 className="user-name">{user.displayName || '用户'}</h3>
                  <p className="user-email">{user.email}</p>
                  <p className="user-provider">通过 {user.provider === 'google' ? 'Google' : 'GitHub'} 登录</p>
                </div>
              </div>
              <button 
                className="logout-btn"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                {isLoading ? '登出中...' : '登出'}
              </button>
            </div>
          ) : (
            // 登录表单
            <div className="login-form">
              {isVerifyMode ? (
                // 验证码输入页面
                <div className="email-login-form">
                  {/* Bytebase 验证页面 */}
                  <div className="verification-page">
                    <h2>验证您的身份</h2>
                    <p>我们已将提供有您的代码的电子邮件发送至<br/>{email}</p>
                    
                    <div className="email-display">
                      <span>{email}</span>
                      <button className="edit-button" onClick={() => setIsVerifyMode(false)}>编辑</button>
                    </div>
                    
                    <div className="floating-label-group">
                      <input
                        type="text"
                        id="verification-code"
                        className="floating-input"
                        placeholder=" "
                      />
                      <label htmlFor="verification-code" className="floating-label">输入代码*</label>
                    </div>
                    
                    <button className="email-toggle-btn">
                      <span>继续</span>
                    </button>
                    
                    <div className="resend-code">
                      <span>没有收到电子邮件？</span>
                      <button className="resend-link">重新发送</button>
                    </div>
                  </div>
                </div>
              ) : !showEmailLogin ? (
                // 第三方登录按钮
                <div className="social-login-section">
                <button
                  className="social-login-btn google-btn"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                >
                  <span className="social-icon">
                    <img src={googleIcon} alt="Google" width="18" height="20" />
                  </span>
                  <span>继续使用 Google</span>
                </button>

                <button
                  className="social-login-btn github-btn"
                  onClick={() => handleSocialLogin('GitHub')}
                  disabled={isLoading}
                >
                  <span className="social-icon">
                    <img src={githubIcon} alt="GitHub" width="35" height="20" />
                  </span>
                  <span>继续使用 GitHub</span>
                </button>

                <button
                  className="social-login-btn microsoft-btn"
                  onClick={() => handleSocialLogin('Microsoft')}
                  disabled={isLoading}
                >
                  <span className="social-icon">
                    <img src={microsoftIcon} alt="Microsoft" width="18" height="18" />
                  </span>
                  <span>继续使用 Microsoft Account</span>
                </button>

                {/* 分割线 */}
                <div className="divider">
                  <div className="divider-line"></div>
                  <span className="divider-text">或</span>
                  <div className="divider-line"></div>
                </div>

                {/* 邮箱输入框 */}
                <div className="floating-label-group">
                  <input
                    type="email"
                    id="login-email"
                    className={`floating-input ${emailError ? (emailErrorType === 'empty' ? 'input-error-empty' : 'input-error-invalid') : ''}`}
                    placeholder=" "
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) {
                        setEmailError(null);
                        setEmailErrorType(null);
                      }
                    }}
                    onFocus={() => {
                      if (emailError) {
                        setEmailError(null);
                        setEmailErrorType(null);
                      }
                    }}
                  />
                  <label htmlFor="login-email" className={`floating-label ${emailError ? (emailErrorType === 'empty' ? 'label-error-empty' : 'label-error-invalid') : ''}`}>电子邮件地址*</label>
                  {emailError && <div className="input-error-message">{emailError}</div>}
                </div>
                
                {/* 邮箱登录切换按钮 */}
                <button
                  className="email-toggle-btn"
                  onClick={toggleEmailLogin}
                  disabled={isLoading}
                >
                  <span>继续</span>
                </button>
              </div>
            ) : (
              // 邮箱登录表单
              <form onSubmit={handleEmailLogin} className="email-login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    邮箱地址 <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入邮箱地址"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    密码 <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    required
                  />
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkbox-text">记住我</span>
                  </label>
                  <a href="#" className="forgot-password">
                    忘记密码？
                  </a>
                </div>

                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? '登录中...' : '登录'}
                </button>

                <button
                  type="button"
                  className="back-btn"
                  onClick={toggleEmailLogin}
                  disabled={isLoading}
                >
                  返回其他登录方式
                </button>
              </form>
              )}
            </div>
          )}

          {/* 底部链接 */}
          <div className="footer-links">
            <span className="footer-text">没有账户？</span>
            <a href="#" className="register-link">注册</a>
          </div>
        </div>
      </div>

      {/* 加载遮罩 */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
