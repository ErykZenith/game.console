local function sendMessage(data)
    SendNUIMessage({
        action = "addMessage",
        data = data
    })
end

RegisterNUICallback("close", function(_, cb)
    SetNuiFocus(false, false)
    cb("ok")
end)

RegisterNUICallback("exec", function(data, cb)
    if type(data) == "string" and data:sub(1, 1) == "/" then
        ExecuteCommand(data:sub(2))
    end
    cb("ok")
end)

RegisterCommand("add", function(_, args)
    if #args >= 2 then
        sendMessage({
            theme = args[1],
            msg = args[2]
        })
    end
end)

local enabled = true
RegisterCommand("enabled", function()
    enabled = not enabled
    SendNUIMessage({
        action = "enabled",
        data = enabled
    })
end)

RegisterKeyMapping("console", "Toggle Console", "keyboard", "T")
RegisterCommand("console", function()
    SetNuiFocus(true, true)
    SendNUIMessage({action = "open"})
end, false)