"""
SeguraSP - servidor local opcional.

O site e 100% estatico e abre por duplo-clique no index.html.
Este script e apenas um atalho para servir os arquivos via HTTP
(util caso o navegador bloqueie algo em file://) e abrir o navegador.

Uso:
    python main.py
Depois acesse: http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 8000

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"SeguraSP rodando em {url}")
        print("Pressione Ctrl+C para encerrar.")
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor encerrado.")
