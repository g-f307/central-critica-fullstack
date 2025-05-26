import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Adicionado useLocation
import { Carousel } from 'react-responsive-carousel';
import { useDropzone } from 'react-dropzone';

const AuthPage = () => {
  const location = useLocation();
  // Define a visualização inicial: se location.state.showRegister for true, mostra cadastro, senão mostra login.
  const [isLoginView, setIsLoginView] = useState(!(location.state?.showRegister === true)); 
  
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const [carouselItems, setCarouselItems] = useState([]);
  const [loadingCarousel, setLoadingCarousel] = useState(true);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCarouselData = async () => {
      setLoadingCarousel(true);
      try {
        const [moviesRes, seriesRes] = await Promise.all([
          fetch('http://localhost:5000/api/movies/popular?page=1'),
          fetch('http://localhost:5000/api/series/popular?page=1')
        ]);
        if (!moviesRes.ok || !seriesRes.ok) {
            console.error("Movie Response Status:", moviesRes.status);
            console.error("Series Response Status:", seriesRes.status);
            throw new Error('Falha ao buscar dados para o carrossel');
        }
        
        const moviesData = await moviesRes.json();
        const seriesData = await seriesRes.json();

        const popularMovies = moviesData.results.filter(item => item.backdrop_path).slice(0, 3).map(item => ({ ...item, media_type: 'movie'}));
        const popularSeries = seriesData.results.filter(item => item.backdrop_path).slice(0, 2).map(item => ({ ...item, media_type: 'tv'}));
        
        let combined = [...popularMovies, ...popularSeries];
        combined.sort(() => 0.5 - Math.random());
        
        setCarouselItems(combined.slice(0, 5));
      } catch (err) {
        console.error("Erro ao buscar dados do carrossel na AuthPage:", err);
        setCarouselItems([]);
      } finally {
        setLoadingCarousel(false);
      }
    };
    if (!user) {
        fetchCarouselData();
    }
  }, [user]);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']},
    multiple: false
  });

  const clearPreview = useCallback(() => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
  }, [previewImage]);

  useEffect(() => {
    if ((isLoginView || successMessage) && previewImage) {
      clearPreview();
    }
  }, [isLoginView, successMessage, previewImage, clearPreview]);

  // Efeito para atualizar a visualização se o estado da rota mudar (ex: usuário clica no link "Cadastre-se" da Hero)
  useEffect(() => {
    if (location.state?.showRegister) {
      setIsLoginView(false);
    } else {
      // Se não houver um estado explícito para mostrar o registro,
      // podemos manter o estado atual ou padronizar para login.
      // A inicialização do useState já cuida do caso de entrada direta na página.
      // setIsLoginView(true); // Descomente se quiser forçar login se não houver state.showRegister
    }
  }, [location.state]);


  const handleLoginSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccessMessage(''); setLoadingForm(true);
    const result = await login(loginEmail, loginPassword);
    setLoadingForm(false); if (!result.success) setError(result.message || 'Falha no login.');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccessMessage('');
    if (registerPassword !== confirmPassword) { setError('As senhas não coincidem!'); return; }
    if (registerPassword.length < 8) { setError('A senha deve ter pelo menos 8 caracteres.'); return; }
    if (!termsAccepted) { setError('Você deve concordar com os Termos de Serviço e Política de Privacidade.'); return; }
    setLoadingForm(true);
    const result = await register({ firstName, lastName, email: registerEmail, password: registerPassword, profileImageUrl: profileImageUrl || null });
    setLoadingForm(false);
    if (result.success) {
        setSuccessMessage(result.message + " Você já pode fazer login."); setIsLoginView(true);
        setFirstName(''); setLastName(''); setRegisterEmail(''); setRegisterPassword('');
        setConfirmPassword(''); setProfileImageUrl(''); setTermsAccepted(false); clearPreview();
    } else { setError(result.message || 'Erro ao registrar.'); }
  };
  
  const inputBaseClasses = "block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm";
  const inputLightClasses = "border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400";
  const inputDarkClasses = "dark:bg-slate-700 dark:border-slate-600 dark:focus:ring-dark-cyan dark:focus:border-dark-cyan dark:text-dark-text-primary dark:placeholder-dark-text-muted";
  const inputIconPadding = "pl-10";
  const buttonClasses = "w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-dark-cyan transition duration-150 ease-in-out";
  const primaryButtonClasses = `${buttonClasses} gradient-bg hover:opacity-90`;
  const socialButtonBase = "w-full inline-flex justify-center items-center py-2 px-4 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-dark-cyan transition duration-150 ease-in-out";
  const socialButtonLight = "border-gray-300 bg-white text-gray-700 hover:bg-gray-50";
  const socialButtonDark = "dark:border-slate-600 dark:bg-slate-700 dark:text-dark-text-secondary dark:hover:bg-slate-600";
  const leftPanelBgClass = "bg-gray-200 dark:bg-dark-bg-secondary";
  const formCardBgClass = "bg-white dark:bg-dark-card";
  const formTitleColor = "text-gray-800 dark:text-dark-text-primary";
  const formMutedTextColor = "text-gray-600 dark:text-dark-text-muted";
  const formLinkColor = "text-purple-600 dark:text-dark-cyan hover:underline";
  const formDividerColor = "text-purple-500 dark:text-purple-400";
  const dropzoneBaseClass = "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-colors";
  const dropzoneLightClass = "border-gray-300 hover:border-purple-400";
  const dropzoneDarkClass = "dark:border-slate-600 dark:hover:border-dark-cyan";
  const dropzoneActiveClass = "border-purple-500 dark:border-dark-cyan";


  return (
    <section className={`min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 bg-gray-50 dark:bg-dark-bg-primary`}>
      <div className="max-w-5xl w-full mx-auto">
        <div className={`flex flex-col lg:flex-row items-stretch shadow-2xl rounded-xl overflow-hidden ${leftPanelBgClass}`}>
          <div className="lg:w-1/2 hidden lg:flex flex-col justify-center relative min-h-[500px] md:min-h-[650px]">
            {loadingCarousel ? (
              <div className="h-full flex items-center justify-center"><p className={`${formTitleColor}`}>Carregando destaques...</p></div>
            ) : carouselItems.length > 0 ? (
              <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} showIndicators={true} interval={5000} className="hero-auth-carousel h-full w-full">
                {carouselItems.map((item) => (
                  <div key={item.id} className="relative h-[500px] md:h-[650px] bg-black"> 
                    <img src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`} alt={item.title || item.name} className="w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white text-left">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 hero-text-shadow">{item.title || item.name}</h3>
                      <p className="text-sm line-clamp-3 hero-text-shadow">{item.overview}</p>
                    </div>
                  </div>
                ))}
              </Carousel>
            ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                    <Link to="/" className="flex items-center space-x-2 mb-8"><i className={`fas fa-film text-3xl text-purple-600 dark:text-dark-cyan`}></i><span className={`text-2xl font-bold ${formTitleColor}`}>Central Crítica</span></Link>
                    <h2 className={`text-3xl font-bold ${formTitleColor} mb-4 hero-text-shadow`}>Junte-se à nossa comunidade</h2>
                    <p className={`${formMutedTextColor} text-lg`}>Descubra, analise e compartilhe suas opiniões.</p>
                </div>
            )}
          </div>

          <div className={`lg:w-1/2 w-full p-8 md:p-12 ${formCardBgClass}`}>
            {error && <p className="mb-4 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-sm">{error}</p>}
            {successMessage && <p className="mb-4 text-center text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 p-3 rounded-md text-sm">{successMessage}</p>}

            {isLoginView ? (
              <div id="login-form">
                <div className="text-center mb-8">
                  <h2 className={`text-3xl font-bold ${formTitleColor}`}>Bem-vindo de volta</h2>
                  <p className={`${formMutedTextColor} mt-2`}>Entre na sua conta para continuar</p>
                </div>
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="login-email" className={`block text-sm font-medium mb-1 ${formMutedTextColor}`}>E-mail</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><i className={`fas fa-envelope text-gray-400 dark:text-slate-500`}></i></div>
                      <input id="login-email" type="email" autoComplete="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className={`${inputBaseClasses} ${inputLightClasses} ${inputDarkClasses} ${inputIconPadding}`} placeholder="seu@email.com" />
                    </div>
                  </div>
                  <div>
                      <div className="flex justify-between items-center mb-1">
                          <label htmlFor="login-password" className={`block text-sm font-medium ${formMutedTextColor}`}>Senha</label>
                          <a href="#" className={`text-sm ${formLinkColor}`}>Esqueceu a senha?</a>
                      </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><i className={`fas fa-lock text-gray-400 dark:text-slate-500`}></i></div>
                      <input id="login-password" type="password" autoComplete="current-password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className={`${inputBaseClasses} ${inputLightClasses} ${inputDarkClasses} ${inputIconPadding}`} placeholder="••••••••" />
                    </div>
                  </div>
                  <div>
                    <button type="submit" disabled={loadingForm} className={`${primaryButtonClasses}`}> {loadingForm ? 'Entrando...' : <>Entrar <i className="fas fa-sign-in-alt ml-2"></i></>} </button>
                  </div>
                </form>
                <div className={`mt-6 divider text-sm font-medium ${formDividerColor}`}>OU CONTINUE COM</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <button type="button" className={`${socialButtonBase} ${socialButtonLight} ${socialButtonDark}`}><i className="fab fa-google text-red-500 mr-2"></i> Google</button>
                    <button type="button" className={`${socialButtonBase} ${socialButtonLight} ${socialButtonDark}`}><i className="fab fa-facebook-f text-blue-600 mr-2"></i> Facebook</button>
                </div>
                <div className="mt-8 text-center">
                  <p className={`text-sm ${formMutedTextColor}`}>Não tem uma conta? <span onClick={() => {setIsLoginView(false); setError(''); setSuccessMessage(''); clearPreview();}} className={`font-medium ${formLinkColor} cursor-pointer`}>Cadastre-se</span></p>
                </div>
              </div>
            ) : (
              <div id="register-form">
                <div className="text-center mb-8">
                  <h2 className={`text-3xl font-bold ${formTitleColor}`}>Crie sua conta</h2>
                  <p className={`${formMutedTextColor} mt-2`}>Junte-se à nossa comunidade de críticos</p>
                </div>
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="register-first-name" className={`block text-sm font-medium mb-1 ${formMutedTextColor}`}>Nome</label>
                      <input id="register-first-name" type="text" autoComplete="given-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`${inputBaseClasses} ${inputLightClasses} ${inputDarkClasses}`} placeholder="Seu nome" />
                    </div>
                    <div>
                      <label htmlFor="register-last-name" className={`block text-sm font-medium mb-1 ${formMutedTextColor}`}>Sobrenome</label>
                      <input id="register-last-name" type="text" autoComplete="family-name" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={`${inputBaseClasses} ${inputLightClasses} ${inputDarkClasses}`} placeholder="Seu sobrenome" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="register-email" className={`block text-sm font-medium mb-1 ${formMutedTextColor}`}>E-mail</label>
                    <input id="register-email" type="email" autoComplete="email" required value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} className={`${inputBaseClasses} ${inputLightClasses} ${inputDarkClasses}`} placeholder="seu@email.com" />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${formMutedTextColor}`}>Foto de Perfil (Arraste ou Clique)</label>
                    <div {...getRootProps()} className={`${dropzoneBaseClass} ${dropzoneLightClass} ${dropzoneDarkClass} ${isDragActive ? dropzoneActiveClass : ''}`}>
                      <input {...getInputProps()} />
                      <div className="space-y-1 text-center">
                        {previewImage ? (
                          <div className="relative group inline-block">
                            <img src={previewImage} alt="Prévia" className="mx-auto h-24 w-24 rounded-full object-cover shadow-md" />
                            <button 
                                type="button" 
                                onClick={(e) => { e.stopPropagation(); clearPreview(); }} 
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                                title="Remover prévia"
                            >
                                <i className="fas fa-times text-xs"></i>
                            </button>
                          </div>
                        ) : (
                          <svg className={`mx-auto h-12 w-12 ${formMutedTextColor}`} stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        <div className={`flex text-sm ${formMutedTextColor} justify-center`}>
                          <p className="pl-1">{isDragActive ? 'Solte a imagem aqui...' : 'Arraste uma imagem, ou clique para selecionar'}</p>
                        </div>
                        <p className={`text-xs ${formMutedTextColor} opacity-70`}>PNG, JPG, GIF, WEBP (Máx. 2MB)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="register-profile-image-url" className={`block text-sm font-medium mb-1 ${formMutedTextColor}`}>URL da Imagem de Perfil (Cole aqui ou use a prévia acima)</label>
                    <input id="register-profile-image-url" type="url" value={profileImageUrl} onChange={(e) => setProfileImageUrl(e.target.value)}
                           className={`${inputBaseClasses} ${inputLightClasses} ${inputDarkClasses}`} placeholder="https://exemplo.com/sua-foto.jpg" />
                    {previewImage && !profileImageUrl && <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">Lembre-se: a prévia é local. Cole a URL da imagem desejada aqui para salvá-la.</p>}
                  </div>

                  <div>
                    <label htmlFor="register-password" className={`block text-sm font-medium mb-1 ${formMutedTextColor}`}>Senha</label>
                    <input id="register-password" type="password" autoComplete="new-password" required value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className={`${inputBaseClasses} ${inputLightClasses} ${inputDarkClasses}`} placeholder="••••••••" />
                    <p className={`mt-1 text-xs ${formMutedTextColor}`}>A senha deve ter pelo menos 8 caracteres.</p>
                  </div>
                  <div>
                    <label htmlFor="register-confirm-password" className={`block text-sm font-medium mb-1 ${formMutedTextColor}`}>Confirmar Senha</label>
                    <input id="register-confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputBaseClasses} ${inputLightClasses} ${inputDarkClasses}`} placeholder="••••••••" />
                  </div>
                  <div className="flex items-center pt-2">
                    <input id="terms" name="terms" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="h-4 w-4 text-purple-600 dark:text-dark-cyan focus:ring-purple-500 dark:focus:ring-dark-cyan border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-700" />
                    <label htmlFor="terms" className={`ml-2 block text-sm ${formMutedTextColor}`}>Eu concordo com os <a href="#" className={`${formLinkColor}`}>Termos</a> e <a href="#" className={`${formLinkColor}`}>Privacidade</a></label>
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={loadingForm} className={`${primaryButtonClasses}`}>{loadingForm ? 'Cadastrando...' : <>Cadastrar <i className="fas fa-user-plus ml-2"></i></>}</button>
                  </div>
                </form>
                <div className={`mt-6 divider text-sm font-medium ${formDividerColor}`}>OU CADASTRE-SE COM</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                   <button type="button" className={`${socialButtonBase} ${socialButtonLight} ${socialButtonDark}`}><i className="fab fa-google text-red-500 mr-2"></i> Google</button>
                    <button type="button" className={`${socialButtonBase} ${socialButtonLight} ${socialButtonDark}`}><i className="fab fa-facebook-f text-blue-600 mr-2"></i> Facebook</button>
                </div>
                <div className="mt-8 text-center">
                  <p className={`text-sm ${formMutedTextColor}`}>Já tem uma conta? <span onClick={() => {setIsLoginView(true); setError(''); setSuccessMessage(''); clearPreview();}} className={`font-medium ${formLinkColor} cursor-pointer`}>Entre aqui</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;