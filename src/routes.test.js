import routes from "./routes"

describe("Property Checking for routes", () => {
    const { auth, drawer } = routes

    const propertyChecker = (tag, routesList, property) => {
        test(tag, () =>{
            routesList.map(route => {
                expect(route).toHaveProperty(property)
            })
        })
    }

    propertyChecker("Each route needs a path", drawer, "path")
    propertyChecker("Each route needs a name", drawer, "name")
    propertyChecker("Each route needs a icon", drawer, "icon")
    propertyChecker("Each route needs a component", drawer, "component")
    propertyChecker("Each route needs a layout", drawer, "layout")
    propertyChecker("Each route needs a path", auth, "path")
    propertyChecker("Each route needs a name", auth, "name")
    propertyChecker("Each route needs a icon", auth, "icon")
    propertyChecker("Each route needs a component", auth, "component")
    propertyChecker("Each route needs a layout", auth, "layout")
})