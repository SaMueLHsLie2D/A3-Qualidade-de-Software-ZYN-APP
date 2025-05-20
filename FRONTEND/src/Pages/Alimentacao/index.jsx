import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Alimentacao() {
    const navigate = useNavigate();


    return (
        <div className='home-container'>
            <nav>
                <a href="#" className="logo"> Zyn </a>

                <div className="links">
                    <button type='button' onClick={() => navigate('/Home')}>Home</button>
                    <button type='button' onClick={() => navigate('/Exercicios')}>Exercícios</button>
                    <button type='button' onClick={() => navigate('/Alimentacao')}>Alimentação</button>
                </div>
            </nav>


            <div className="nft-shop">
                <h2 className="separator">Dicas de Alimentação</h2>

                <div className="nft-list">
                    <div className="item">
                        <img src="src\assets\higratacao.jpg" alt="Corrida" />

                        <div className="info">
                            <div>
                                <h5>Trilha de Hidratação</h5>
                            </div>
                        </div>
                        <div className="bid">
                            <a href="#">Manter-se hidratado é essencial para o bom funcionamento do corpo. A água regula a temperatura, transporta nutrientes e melhora o desempenho físico.</a>
                        </div>
                    </div>

                    <div className="item">
                        <img width={280} height={220} src="src\assets\jejum.webp" alt="Natação" />
                        <div className="info">
                            <div>
                                <h5>Como realizar um jejum da forma correta?</h5>
                            </div>
                        </div>
                        <div className="bid">
                            <a href="#">O jejum pode trazer benefícios quando feito com orientação. É importante respeitar os limites do corpo, manter a hidratação e se alimentar bem nas janelas de alimentação.</a>
                        </div>
                    </div>



                    <div className="item">
                        <img width={280} height={220} src="src\assets\gerenciarPeso.avif" alt="Ciclismo" />
                        <div className="info">
                            <div>
                                <h5>Gerenciando seu Peso</h5>
                            </div>
                        </div>
                        <div className="bid">
                            <a href="#">Controlar o peso de forma saudável envolve equilíbrio entre alimentação, sono e atividade física. Foque em alimentos naturais e evite dietas radicais.</a>
                        </div>
                    </div>

                    <div className="item">
                        <img width={280} height={220} src="src\assets\energia.png" alt="Musculação" />
                        <div className="info">
                            <div>
                                <h5>Alimentos que dão Energia</h5>
                              
                            </div>
                        </div>
                        <div className="bid">
                            <a href="#">Inclua fontes de carboidratos complexos, proteínas magras e gorduras boas no seu dia a dia. Frutas, grãos integrais e oleaginosas são ótimas escolhas.</a>
                        </div>
                    </div>
                </div>
            </div>


            <div className="nft-shop">

                <div className="nft-list">
                    <div className="item">
                        <img src="src\assets\equilibrio.avif" alt="Corrida" />

                        <div className="info">
                            <div>
                                <h5>Equilíbrio Nutricional</h5>
                            </div>
                        </div>
                        <div className="bid">
                            <a href="#">Monte pratos com variedade: proteínas magras, carboidratos complexos, gorduras boas e muitas fibras.</a>
                        </div>
                    </div>

                    <div className="item">
                        <img width={280} height={220} src="src\assets\mac.webp" alt="Natação" />
                        <div className="info">
                            <div>
                                <h5>Evite Ultraprocessados</h5>
                            </div>
                        </div>
                        <div className="bid">
                            <a href="#">Prefira alimentos naturais ou minimamente processados. Leia os rótulos e fuja de ingredientes que você não reconhece.</a>
                        </div>
                    </div>



                    <div className="item">
                        <img width={280} height={220} src="src\assets\planRef.avif" alt="Ciclismo" />
                        <div className="info">
                            <div>
                                <h5>Planejamento de Refeições</h5>
                            </div>
                        </div>
                        <div className="bid">
                            <a href="#">Prepare suas refeições com antecedência para evitar decisões impulsivas. Lanches saudáveis sempre à mão ajudam muito.</a>
                        </div>
                    </div>

                    <div className="item">
                        <img width={280} height={220} src="src\assets\atcao.png" alt="Musculação" />
                        <div className="info">
                            <div>
                                <h5>Coma com Atenção</h5>
                              
                            </div>
                        </div>
                        <div className="bid">
                            <a href="#">Evite comer com pressa ou distraído (como vendo TV). Mastigue bem, saboreie os alimentos e escute os sinais de fome e saciedade do seu corpo.</a>
                        </div>
                    </div>
                </div>
            </div>



            <div class="footer">
                <h3> Foco, Determinação e Empenho </h3>

                <div class="right">
                    <div class="links">
                        <a href="#"> Politica de Privacidade </a>
                        <a href="#"> Cooperação </a>
                        <a href="#"> Patrocínio </a>
                        <a href="#"> Contato </a>
                    </div>
                </div>

                <p>Copyright © 2025, All Rights Reserved.</p>

            </div>
        </div>

        
    )
}

export default Alimentacao;