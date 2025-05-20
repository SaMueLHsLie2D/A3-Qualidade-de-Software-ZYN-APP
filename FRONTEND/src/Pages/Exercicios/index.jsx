import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './art.css';


function Exercicios() {
    const navigate = useNavigate();

    const [km, setKm] = useState(5);
    const [agua, setAgua] = useState(3.5);
    const [tempo, setTempo] = useState(30);

    const adjust = (setter, value, delta) => {
        const newValue = Math.max(0, parseFloat(value) + delta);
        setter(parseFloat(newValue.toFixed(1)));
    }

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

            <h2 class="separator"> Exercicios Fisicos </h2>

            <div class="nft-shop">
                <div class="category">
                    <a href="#corrida">Dicas de Corrida</a>
                    <a href="#calorias">Perda de Calorias</a>
                    <a href="#gordura">Teor de Gordura</a>
                </div>

                <div class="nft-list">
                    <div class="item">
                        <img src="src\assets\run.webp" />
                        <h5> Kilometros Pecorridos </h5>

                        <div class="info">

                            <div className='meta'>
                                <p id='meta-style'>Meta de 10km</p>
                                <p>{km} km percorridos</p>

                                <div className="controls">
                                    <button onClick={() => adjust(setKm, km, 1)}>+</button>
                                    <button onClick={() => adjust(setKm, km, -1)}>-</button>
                                </div>
                            </div>
                        </div>

                        <div class="bid">
                            <p>2h 28m 1s</p>
                            <a href="#"> Tempo de exercicio realizado </a>
                        </div>
                    </div>


                    <div className="item">
                        <img width={280} height={220} src="src/assets/agua.jpg" alt="Água" />
                        <h5>Litros de Água</h5>

                        <div className="info">
                            <div className="meta">
                                <p id="meta-style">Meta de 6L de água</p>
                                <p>{agua} L de 6L</p>
                                <div className="controls">
                                    <button onClick={() => adjust(setAgua, agua, 0.5)}>+</button>
                                    <button onClick={() => adjust(setAgua, agua, -0.5)}>-</button>
                                </div>
                            </div>
                        </div>

                        <div className="bid">
                            <p>{agua} Litros</p>
                            <a href="#">Litros por dia</a>
                        </div>
                    </div>

                    <div className="item">
                        <img width={280} height={220} src="src/assets/atv.png" alt="Atividades" />
                        <h5>Atividades Físicas</h5>

                        <div className="info">
                            <div className="meta">
                                <p id="meta-style">Meta de 2 horas</p>
                                <p>{tempo} min realizados</p>
                                <div className="controls">
                                    <button onClick={() => adjust(setTempo, tempo, 5)}>+</button>
                                    <button onClick={() => adjust(setTempo, tempo, -5)}>-</button>
                                </div>
                            </div>
                        </div>

                        <div className="bid">
                            <p>{tempo} min</p>
                            <a href="#">Tempo de exercício realizado</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="home-widget">
                <div id="corrida" className="item">
                    <div className="header">
                        <i className="bx bx-run"></i>
                        <h4>Dicas de Corrida</h4>
                    </div>
                    <p>
                        Correr é uma ótima forma de exercício!
                        Melhore seu desempenho com treinos de resistência, boa postura e constância semanal.
                    </p>
                </div>

                <div id="calorias" className="item">
                    <div className="header">
                        <i className="bx bx-food-menu"></i>
                        <h4>Perda de Calorias</h4>
                    </div>
                    <p>
                        Exercícios como HIIT, natação e ciclismo são ideais para queima calórica.
                        Combine com uma alimentação equilibrada para melhores resultados.
                    </p>
                </div>

                <div id="gordura" className="item">
                    <div className="header">
                        <i className="bx bx-body"></i>
                        <h4>Teor de Gordura</h4>
                    </div>
                    <p>
                        Reduza gordura corporal focando em treinos de força e dieta hipocalórica.
                        O acompanhamento nutricional pode acelerar seu progresso.
                    </p>
                </div>
            </div>

            <div className="nft-shop">
                <h2 className="separator">Exercícios para Emagrecimento</h2>

                <div className="nft-list">
                    <div className="item">
                        <img src="src\assets\corrida1.avif" alt="Corrida" />

                        <div className="info">
                            <div>
                                <h5>Corrida</h5>
                                <div className="btc">
                                    <i className="bx bx-run"></i>
                                    <p>30-45 min por sessão</p>
                                </div>
                            </div>
                            <p>5 vezes por semana</p>
                        </div>
                        <div className="bid">
                            <a href="#">Ideal para alta queima de calorias</a>
                        </div>
                    </div>

                    <div className="item">
                        <img width={280} height={220} src="src\assets\nat.jpg" alt="Natação" />
                        <div className="info">
                            <div>
                                <h5>Natação</h5>
                                <div className="btc">
                                    <i className="bx bx-water"></i>
                                    <p>30-60 min por sessão</p>
                                </div>
                            </div>
                            <p>3 vezes por semana</p>
                        </div>
                        <div className="bid">
                            <a href="#">Excelente para resistência e perda de peso</a>
                        </div>
                    </div>



                    <div className="item">
                        <img width={280} height={220} src="src\assets\cicli.avif" alt="Ciclismo" />
                        <div className="info">
                            <div>
                                <h5>Ciclismo</h5>
                                <div className="btc">
                                    <i className="bx bx-bicycle"></i>
                                    <p>45-60 min por sessão</p>
                                </div>
                            </div>
                            <p>3 vezes por semana</p>
                        </div>
                        <div className="bid">
                            <a href="#">Fortalece pernas e queima gordura</a>
                        </div>
                    </div>

                    <div className="item">
                        <img width={280} height={220} src="src\assets\musc2.png" alt="Musculação" />
                        <div className="info">
                            <div>
                                <h5>Musculação</h5>
                                <div className="btc">
                                    <i className="bx bx-dumbbell"></i>
                                    <p>40-60 min por sessão</p>
                                </div>
                            </div>
                            <p>3 vezes por semana</p>
                        </div>
                        <div className="bid">
                            <a href="#">Aumenta massa muscular e acelera metabolismo</a>
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

export default Exercicios;