"""Entry point for running the backend server (used by PyInstaller)."""
import os
import uvicorn


def main() -> None:
    port_str = os.environ.get("PORT", "8000")
    try:
        port = int(port_str)
    except ValueError:
        raise ValueError(
            f"Invalid PORT environment variable: {port_str!r}. Must be an integer."
        )
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=port,
        log_level="warning",
        access_log=False,
    )


if __name__ == "__main__":
    main()
