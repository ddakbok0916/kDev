'use client';

import { FetchClient } from '@/lib/FetchClient';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

function SignUpForm () {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter()

  const onSubmit = (data) => {
    console.log(data);
    if (confirm('가입 하시겠습니까?')) {
      FetchClient('/api/user/join', { method: 'POST', body: JSON.stringify({ data: data }) }).then((res) => {
        if (res) {
          alert('가입에 성공하셨습니다.');
          router.push('/')
        }
      });
    }
    // 회원가입 로직을 여기에 추가하세요
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor='username'>사용자 이름</label>
        <input id='username' name='username' type='text' {...register('username', { required: '이 필드는 필수입니다' })} />
        {errors.username && <p>{errors.username.message}</p>}
      </div>
      <div>
        <label htmlFor='password'>비밀번호</label>
        <input
          id='password'
          name='password'
          type='password'
          {...register('password', {
            required: '이 필드는 필수입니다',
            minLength: {
              value: 8,
              message: '비밀번호는 최소 8자 이상이어야 합니다',
            },
          })}
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor='mobile'>Mobile</label>
        <input
          id='mobile'
          name='mobile'
          type='text'
          {...register('mobile', {
            required: '이 필드는 필수입니다',
            minLength: {
              value: 10,
              message: '올바른 형식을 입력해 주세요.',
            },
          })}
        />
        {errors.mobile && <p>{errors.mobile.message}</p>}
      </div>
      <button type='submit'>회원가입</button>
    </form>
  );
}

export default SignUpForm;
