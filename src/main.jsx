import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'material-icons'
import { SnackbarProvider } from 'notistack'

ReactDOM.createRoot(document.getElementById("root")).render(
        <SnackbarProvider
                dense
                preventDuplicate
                maxSnack={3}
                anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                }}
                ref={notistackRef}
                action={key => (
                        <button aria-label="Close" onClick={() => notistackRef.current.closeSnackbar(key)}>
                        <span className="material-icons" style={{ color: theme.palette.white.main }}>
                                close
                        </span>
                        </button>
                )}
        >
                <App />

        </SnackbarProvider>
)
