import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { LBtn } from '../components/common/Buttons';
import { EmailInput, PassWordInput, TextLabel } from '../components/common/TextAciveInput'

const LoginMain = styled.section`
    width: 100vw;
    padding: 0 5%;
    .loginTitle {
        font-family: 'Spoqa Han Sans Neo';
        font-weight: 500;
        font-size: 24px;
        line-height: 30px;
        text-align: center;
        margin: 30px 0 40px;
    }
    .loginBtnWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`

const LoginBtn = styled(LBtn)`
    margin: 30px 0 20px;
`

const JoinEmailLink = styled(Link)`
    font-family: 'Spoqa Han Sans Neo';
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
`

const ErrorMessage = styled.div`
    margin: -10px 0 16px;
    font-family: 'Spoqa Han Sans Neo';
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: var(--warning-color);
`;

function LoginPage(props) {
    //이메일, 비밀번호
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    //오류메시지 상태저장
    const [emailMessage, setEmailMessage] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')
    // 유효성 검사
    const [isEmail, setIsEmail] = useState(false)
    const [isPassword, setIsPassword] = useState(false)

    // 📍 이메일
    const onChangeEmail = (email) => {
        const emailRegex =
            /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        const emailCurrent = email.target.value;
        setEmail(emailCurrent)

        if (!emailCurrent.length) {
            setEmailMessage('*필수 입력사항입니다.');
            return;
        }

        if (!emailRegex.test(emailCurrent)) {
            setEmailMessage('*잘못된 이메일 형식입니다.');
            setIsEmail(false);
            return;
        }
        setEmailMessage('');
        setIsEmail('');
        // setLoginValid(true);
    };

    // 📍 비밀번호
    const onChangePassword = (password) => {
        const passwordCurrent = password.target.value
        setPassword(passwordCurrent)

        if (!passwordCurrent.length) {
            setPasswordMessage('*필수 입력사항입니다.')
            setIsPassword(false);
            return;
        }
        if (passwordCurrent.length < 6) {
            setPasswordMessage('*비밀번호는 6자 이상이어야 합니다.');
            setIsPassword(false);
            return;
        }
        setPasswordMessage('');
    };

    // 📍 로그인
    async function handleLoginSubmit(e) {
        e.preventDefault();
        const url = 'https://mandarin.api.weniv.co.kr';
        const reqPath = '/user/login';
        const userData = {
            user: {
                email: email.target.value,
                password: password.target.value,
            },
        };
        try {
            const res = await fetch(url + reqPath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const resJson = await res.json();
            //왜 안찍히는지?
            console.log(resJson);
            if (resJson.message === '이메일 또는 비밀번호가 일치하지 않습니다.') {
                setPasswordMessage('*이메일 또는 비밀번호가 일치하지 않습니다.');
            } else {
                //로컬스토리지에 저장하기
                localStorage.setItem('userInfo', JSON.stringify(resJson));
                //페이지 이동
                props.history.push('/homepage');
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <LoginMain>
            <h1 className='ir'>데브타운 로그인 화면</h1>
            <h2 className='loginTitle'>로그인</h2>
            <form className='loginForm'>
                <TextLabel>이메일</TextLabel>
                <EmailInput
                    typeName='email'
                    onChange={onChangeEmail}
                />
                {emailMessage && (
                    <ErrorMessage>{emailMessage}</ErrorMessage>
                )}
                <TextLabel>비밀번호</TextLabel>
                <PassWordInput
                    typeTitle="password"
                    onChange={onChangePassword} />
                {passwordMessage && (
                    <ErrorMessage>{passwordMessage}</ErrorMessage>
                )}
            </form>
            <div className='loginBtnWrap'>
                <LoginBtn
                    type='submit'
                    disabled={!(isEmail && isPassword)}
                    onClick={handleLoginSubmit}>로그인</LoginBtn>
                <JoinEmailLink to='#'>이메일로 회원가입</JoinEmailLink>
            </div>
        </LoginMain >
    )
}

export default LoginPage;
