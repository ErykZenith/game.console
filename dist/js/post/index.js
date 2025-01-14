var post = async (
    eventName,
    data,
) => {
    const options = {
        method: "post",
        body: JSON.stringify(data),
    };

    const resourceName = window.GetParentResourceName? window.GetParentResourceName(): '';

    if (!resourceName) {
        return null
    }

    const resp = await fetch(`https://${resourceName}/${eventName}`, options);

    const respFormatted = await resp.json();

    return respFormatted;
}
