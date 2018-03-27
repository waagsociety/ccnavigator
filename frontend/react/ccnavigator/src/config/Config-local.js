/* endpoint runs on different port then react (port 3000) in development mode
 * cors headers need to be set in Apache
 */
const Config = {
	endPoint : {
		host: "ccn.local",
    port: "80",
		path: "",
    protocol: "http"
  }
}

export default Config;
