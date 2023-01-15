import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './assets/comps/supabase'
import Auth from './assets/comps/login'
import Account from './assets/comps/acc'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClientProvider,QueryClient } from 'react-query'
const queryClient = new QueryClient()
export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>

    <NavigationContainer>

    <PaperProvider>

    <View>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
    </PaperProvider>
    </NavigationContainer>
    </QueryClientProvider>
  )
}