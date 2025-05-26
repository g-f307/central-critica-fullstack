import React from 'react';

const AboutPage = () => {
  return (
    <section id="about" className="py-12 bg-white dark:bg-dark-bg-secondary"> {/* Fundo de card para a seção */}
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-dark-text-primary">Sobre Nós</h2>
                <p className="text-lg text-gray-700 dark:text-dark-text-secondary mb-8">
                    A Central Crítica nasceu da paixão por cultura e da necessidade de um espaço onde amantes de cinema e séries pudessem compartilhar suas opiniões de forma construtiva. Nosso objetivo é criar uma comunidade engajada que discuta obras culturais com profundidade e respeito.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-gray-100 dark:bg-dark-card p-6 rounded-lg"> {/* Fundo de card para os itens */}
                        <i className="fas fa-film text-4xl text-purple-700 dark:text-dark-cyan mb-4"></i>
                        <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-dark-text-primary">Missão</h3>
                        <p className="text-gray-600 dark:text-dark-text-secondary">Promover discussões ricas e análises profundas sobre produções culturais.</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-dark-card p-6 rounded-lg">
                        <i className="fas fa-users text-4xl text-purple-700 dark:text-dark-cyan mb-4"></i>
                        <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-dark-text-primary">Visão</h3>
                        <p className="text-gray-600 dark:text-dark-text-secondary">Ser a principal referência em críticas culturais colaborativas no Brasil.</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-dark-card p-6 rounded-lg">
                        <i className="fas fa-heart text-4xl text-purple-700 dark:text-dark-cyan mb-4"></i>
                        <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-dark-text-primary">Valores</h3>
                        <p className="text-gray-600 dark:text-dark-text-secondary">Respeito, paixão pela cultura e incentivo à diversidade de vozes de quem ama opinar.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default AboutPage;