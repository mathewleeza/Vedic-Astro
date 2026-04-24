# -*- mode: python ; coding: utf-8 -*-
import os
from PyInstaller.utils.hooks import collect_data_files, collect_dynamic_libs

block_cipher = None

datas = []
datas += collect_data_files('swisseph', include_py_files=False)
datas += collect_data_files('timezonefinder', include_py_files=False)
# Include the static web build if it exists
static_dir = os.path.join(os.getcwd(), 'static')
if os.path.isdir(static_dir):
    datas += [(static_dir, 'static')]

a = Analysis(
    ['server.py'],
    pathex=['.'],
    binaries=collect_dynamic_libs('swisseph'),
    datas=datas,
    hiddenimports=[
        'uvicorn.logging',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        'app.api.routes.chart',
        'app.api.routes.dasha',
        'app.api.routes.analysis',
        'app.api.routes.geo',
        'app.api.routes.settings',
        'timezonefinder',
        'geopy',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='vedic-astro-backend',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='vedic-astro-backend',
)
