const mintButtonStyles = {
    background: "transparent",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "#0052FF",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
};

export default function Button(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        isLoading: boolean;
    }
) {
    const { onClick, isLoading, children } = props;

    return (
        <button onClick={onClick} style={mintButtonStyles} disabled={isLoading}>
            {children}
        </button>
    );
}
