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
      <MenuBar />
      <center>
            <div class="upper">
              <div class="logo">
                <a href="#">
                  <img src="../../public/mona-lisa.png" class="img-logo"/>
                </a>
              </div>
              <div class="login-div">
                <form class="login">
                  <h3>Sign In</h3>
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
                  <div class="new-members">
                    New to DataOmni? <a href="#" class="signup-link">Sign up now</a>.
                  </div>
                </form>
              </div>
            </div> 
        <div class="bottom">
          <div class="bottom-width">
            Questions? Call <a href="tel:1-800-000-0000" class="tel-link">1-800-000-0000</a>
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
      </center>
            
    <ParticlesBg num={200} type="cobweb" bg={true} /> 
    </>
    )
  }

}

export default LoginPage

