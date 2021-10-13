import React from 'react';
import './custom-signup.css';
import '../scrollbar/custom-scrollbar.css';
import svg_logo from '../../imgs/certlify-svg-logo.png';

export class SignUp extends React.Component{
    render(){
        return(
            <section>
                <header>
        <nav className="section-links">
            <ul className="home-links">
                <li><a href="/">Home</a>
                </li>
            </ul>
        </nav>
        <span className="logo"><img src={svg_logo} alt="Certlify logo"/></span>
    </header>

    <main>
        <section className="sign-page-section">
            <h1 className="first-text">Sign up</h1>
            <p className="second-text">Hi there! Kindly enter the following details to create an account</p>

            <form id="form-input" className="form-input"onSubmit="return false">
                <input type="email" id="email" placeholder="Enter your e-mail" name="email" autocomplete="email"
                    minlength="4" required/>
                <p style={{display:"none"}} id="email-message" className="message"></p>
                <input type="text" id="organization" placeHolder="Enter your personal/organization name"
                    name="organization" minLength="2" autoComplete="organization" required/>
                <input type="password" id="password" placeholder="Enter your password" name="password"
                    autocomplete="new-password" minLength="8" required/>
                <input type="password" id="con-password" placeholder="Confirm your password" name="con-password"
                    autocomplete="new-password" minlength="8" required/>
                <p style={{display:"none"}} id="password-message" className="message"></p>
                <button type="submit" onClick="matchpassword()" className="sign-log">
                    Sign up
                </button>
            </form>
            <p>Already have an account? <a id="login" href="/login">Login</a></p>
        </section>
    </main>
            </section>
        );
    }
}