import './art.css'
import { useNavigate } from 'react-router-dom';


function Home() {
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

      <header>
        <div className="left">
          <h1> Vamos começar sua jornada de <span> Exercícios </span></h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque, eaque harum. Nobis ipsam magni labore?</p>

        </div>

        <img src="src\assets\header.png" alt="" />
      </header>

      <div class="home-widget">
            <div class="item">
                <div class="header">

                    <i class="bx bx-home-alt"></i>
                    <h4> Como funciona o jejum? </h4>
                </div>

                <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. ?Eligendi quia facere rerum a ducimus facilis quasi
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. ?Eligendi quia facere rerum a ducimus facilis quasi
                </p>
            </div>

            <div class="item">

                <div class="header">
                    <i class="bx bx-grid-alt"></i>
                    <h4> 10 alimetos essenciais na dieta </h4>
                </div>
                <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. ?Eligendi quia facere rerum a ducimus facilis quasi lorem
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. ?Eligendi quia facere rerum a ducimus facilis quasi
                </p>
            </div>

            <div class="item">

                <div class="header">
                    <i class="bx bx-grid-alt"></i>
                    <h4> Quantas calorias voce precissa? </h4>
                </div>
                <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. ?Eligendi quia facere rerum a ducimus facilis quasi lorem
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. ?Eligendi quia facere rerum a ducimus facilis quasi
                </p>
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

export default Home
