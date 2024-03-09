- user register using email and password (/register)
- email and password save to db with is_active = false
- generate otp and save to redis with expiry time
- send otp to user email
- user enter otp to activate account (/verify)
- user can regenerate new otp and resend otp to user email (/resend)

Request Body :

- /register

```json
{
  "email": "test@gmail.com",
  "password": "123456"
}
```

- /verify

```json
{
  "email": "test@gmail.com",
  "otp": "123456"
}
```

- /resend

```json
{
  "email": "test@gmail.com"
}
```

TODO :

- hash password before save to db
