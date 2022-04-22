import React from 'react';
import ParticlesBg from 'particles-bg'
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
//import { getAllMatches, getAllPlayers } from '../fetcher'


class LoginPage extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }


  render() {
    return (
      <>
        <div>...
            <MenuBar />
            <div class="upper">
              <div class="logo">
                <a href="#">
                  <img src="../assets/logo.png" class="img-logo"/>
                </a>
              </div>
              <div class="login-div">
                <form class="login">
                  <h1>Sign In</h1>
                  <div class="input-text">
                      <input type="text" id="inputEmail" name="email" placeholder="Email or phone number" />
                      <div class="warning-input" id="warningEmail">
                        Please enter a valid email or phone number.
                      </div>
                  </div>
                
                  <div class="input-text">
                    <input type="password" id="inputPassword" name="password" placeholder="Password" />
                    <div class="warning-input" id="warningPassword">
                        Your password must contain between 4 and 60 characters.
                    </div>
                  </div>
                
                  <div>
                    <button class="signin-button">Sign In</button>
                  </div>
                  <div class="remember-flex">
                    <div>
                        <input type="checkbox" />
                        <label class="color_text">Remember me</label>
                    </div>
                    <div class="help">
                        <a class="color_text" href="#">Need help?</a>
                    </div>
                  </div>
                  <div class="login-face">
                    <img src="../assets/fb.svg" height="20"/><a href="#" class="color_link log_face">Login with Facebook</a>
                  </div>
                  <div class="new-members">
                    New to DataOmni? <a href="#" class="signup-link">Sign up now</a>.
                  </div>
                  <div class="protection color_link help">
                    This page is protected by Google reCAPTCHA to ensure you're not a bot. <a href="#">Learn more.</a>
                  </div>
                </form>
              </div>
            </div> 
        </div>
        <div class="bottom">
        <div class="bottom-width">
            Questions? Call <a href="tel:1-844-542-4813" class="tel-link">1-844-542-4813</a>
            <div>
                <ul class="bottom-flex">
                    <li class="list-bottom">
                        <a href="#" class="link-bottom">
                            FAQ
                        </a>
                    </li>
                    <li class="list-bottom">
                        <a href="#" class="link-bottom">
                            Help Center
                        </a>
                    </li>
                    <li class="list-bottom">
                        <a href="#" class="link-bottom">
                            Terms of Use
                        </a>
                    </li>
                    <li class="list-bottom">
                        <a href="#" class="link-bottom">
                            Privacy
                        </a>
                    </li>
                    <li class="list-bottom">
                        <a href="#" class="link-bottom">
                            Cookie Preferences
                        </a>
                    </li>
                    <li class="list-bottom">
                      <a href="#" class="link-bottom">
                            Corporate information
                      </a>
                    </li>
                </ul>
            </div>
            <div>
                <select class="fa select-language">
                    <option> &#xf0ac; &nbsp;&nbsp;&nbsp;English</option>
                    <option> &#xf0ac; &nbsp;&nbsp;&nbsp;Fran&ccedil;ais</option>
                </select>
            </div>
        </div>
        </div>
              
        <ParticlesBg type="circle" bg={true} />
      </>
    )
  }

}

export default LoginPage

