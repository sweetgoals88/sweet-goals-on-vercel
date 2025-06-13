import { HashLoader } from "react-spinners";

export default function LoadingScreen() {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "100vh"
        }}>
            <section style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10vh"
            }}>
                <header>
                    <h1 style={{
                        margin: 0,
                        color: "lightgray",
                        textAlign: "center",
                        fontSize: "2rem"
                    }}>
                        Conectando con la base de datos
                    </h1>
                    <h3 style={{
                        margin: 0,
                        color: "lightgray",
                        textAlign: "center",
                        fontWeight: "normal"
                    }}>
                        Esto puede tardar unos momentos
                    </h3>
                </header>
                <main>
                    <HashLoader color={"#2ecc71"} size={"100px"} />
                </main>
            </section>
        </div>
    );
}