import Ititle from "../../types/ITitle"

const Title = ({ children, classes }: Ititle) => {
   return (
      <h6 className={classes}>
         <span>{children}</span>
      </h6>
   )
}

export default Title