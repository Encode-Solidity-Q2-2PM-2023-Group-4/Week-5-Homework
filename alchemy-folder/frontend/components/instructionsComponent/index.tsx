import styles from "./instructionsComponent.module.css";

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            Lottery<span> Web3 dApp</span>
          </h1>
          <h3></h3>
        </div>
      </header>

      <div className={styles.buttons_container}>
        <div className={styles.button}>
          <p>Add Components</p>
        </div>
        <div className={styles.button}>
          <p>Explore Templates</p>
        </div>
        <div className={styles.button}>
          <p>Visit Docs</p>
        </div>
        <div className={styles.button}>
          <p>Contribute</p>
        </div>
      </div>
    </div>
  );
}

function displayOwnerPool() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const {isConnected, isDisconnected} = useAccount();

  useEffect(() => {
    fetch("https://localhost:3001/display-owner-pool'")
      .then((res) => res.json())
      .then((data) => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <p>{data}</p>
    </div>
  );
}

function checkState() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const {isConnected, isDisconnected} = useAccount();

  useEffect(() => {
    fetch("https://localhost:3001/check-state'")
      .then((res) => res.json())
      .then((data) => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <p>{data}</p>
    </div>
  );
}
