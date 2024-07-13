import PacmanLoader from "react-spinners/PacmanLoader"

const LoadingPage = () => {
  return (
    <>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <PacmanLoader color="#a805ff" />
      </div >
    </>
  )
}

export default LoadingPage