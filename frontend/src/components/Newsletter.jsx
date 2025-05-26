import React from 'react';

const Newsletter = () => {
    return (
        // A seção Newsletter já usa gradient-bg, que será adaptado pelo index.css
        <section className="py-12 gradient-bg text-white"> 
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Receba as últimas novidades</h2>
                <p className="text-xl mb-6 max-w-2xl mx-auto text-purple-200 dark:text-dark-text-secondary">
                    Assine nossa newsletter e fique por dentro das melhores críticas e lançamentos culturais.
                </p>
                <form className="flex flex-col sm:flex-row max-w-md mx-auto sm:max-w-xl" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder="Seu e-mail" 
                        // Estilo do input do seu protótipo modoEscuro.html
                        className="bg-white dark:bg-slate-700 text-gray-900 dark:text-dark-text-primary px-3 py-2 rounded-l-full sm:rounded-r-none rounded-full mb-2 sm:mb-0 flex-grow focus:outline-none focus:ring-1 focus:ring-purple-500 dark:focus:ring-dark-cyan w-full"
                    />
                    <button 
                        type="submit"
                        // Estilo do botão do seu protótipo modoEscuro.html
                        className="bg-purple-700 dark:bg-dark-cyan hover:bg-purple-800 dark:hover:bg-cyan-700 px-4 py-2 rounded-r-full sm:rounded-l-none rounded-full text-white"
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;