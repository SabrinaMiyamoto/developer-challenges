'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { useDispatch } from 'react-redux';
import { login } from '@/store/auth-slice';
import { paths } from '@/paths';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email é obrigatório' }).email('Formato de email inválido'),
  token: zod.string().min(1, { message: 'A senha é obrigatória' }),
});

type Values = zod.infer<typeof schema>;

//senha e email fixos

const FIXED_USERS = [
  { email: 'user@teste.com', token: 'senha123' },
  { email: 'admin@teste.com', token: 'admin123' },
];

//Para já deixar preenchida, para que eu não precise ficar escrevendo a senha
const defaultValues = { email: FIXED_USERS[0].email, token: FIXED_USERS[0].token } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();


  const [showToken, setshowToken] = React.useState<boolean>();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });
  

const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

    

      const foundUser = FIXED_USERS.find(
        (user) => user.email === values.email && user.token === values.token
      );

      if (foundUser) {
        dispatch(login({ email: foundUser.email, token: foundUser.token }))
        await new Promise((resolve) => setTimeout(resolve, 0))
        router.push(paths.dashboard.overview)
        setIsPending(false)
        return
      }

      setError('root', { type: 'manual', message: 'Email ou senha incorretos' });
      setIsPending(false);
    },
    [dispatch, router, setError]
  )

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
        <Typography color="text.secondary" variant="body2">
          Ainda não tem uma conta?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            Cadastre-se
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email</InputLabel>
                <OutlinedInput {...field} label="Email" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="token"
            render={({ field }) => (
              <FormControl error={Boolean(errors.token)}>
                <InputLabel>Senha</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showToken ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setshowToken(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setshowToken(true);
                        }}
                      />
                    )
                  }
                  label="Senha"
                  type={showToken ? 'text' : 'password'}
                />
                {errors.token ? <FormHelperText>{errors.token.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              Esqueceu a senha?
            </Link>
          </div>
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Entrar
          </Button>
        </Stack>
      </form>
      <Alert color="warning">
        Use{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          user@teste.com
        </Typography>{' '}
        com a senha{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          senha123
        </Typography>
        ou{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          admin@desafio.com
        </Typography>{' '}
        com a senha{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          admin123
        </Typography>
      </Alert>
    </Stack>
  );
}
