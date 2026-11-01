from django.test import Client, TestCase, override_settings


class RenderProxyCSRFSecurityTests(TestCase):
    @override_settings(ALLOWED_HOSTS=['roles-backend.onrender.com'])
    def test_login_post_from_render_https_origin_passes_csrf(self):
        client = Client(enforce_csrf_checks=True)
        host = 'roles-backend.onrender.com'
        proxy_headers = {
            'HTTP_HOST': host,
            'HTTP_X_FORWARDED_PROTO': 'https',
        }

        get_response = client.get('/login/', **proxy_headers)
        csrf_token = client.cookies['csrftoken'].value
        post_response = client.post(
            '/login/',
            {
                'username': 'csrf-check-invalid',
                'password': 'invalid',
                'csrfmiddlewaretoken': csrf_token,
            },
            HTTP_ORIGIN=f'https://{host}',
            **proxy_headers,
        )

        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(post_response.status_code, 200)
        self.assertContains(post_response, 'Invalid username or password')
