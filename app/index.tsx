/* eslint-disable camelcase */

import { View, Text, TouchableOpacity } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useRouter } from 'expo-router'

import NLWlogo from '../src/assets/logo-nlw.svg'

import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { useEffect } from 'react'
import { api } from '../src/lib/api'
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/92b438c67879069f1ae8',
}

export default function App() {
  const router = useRouter()

  const [, response, singInWithGitHub] = useAuthRequest(
    {
      clientId: '92b438c67879069f1ae8',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'spacetime',
      }),
    },
    discovery,
  )

  async function handleGitHubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code,
    })

    const { token } = response.data

    SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      handleGitHubOAuthCode(code)
    }
  }, [response])

  return (
    <View
      className="flex-1 items-center px-8 py-10"
    >
      <View className="flex-1 items-center justify-center gap-6">
        <NLWlogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => singInWithGitHub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastar Lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>

    </View>
  )
}
