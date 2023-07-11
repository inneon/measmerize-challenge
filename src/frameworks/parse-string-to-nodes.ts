import Joi from "joi"
import fs from "fs"
import { Node, NodeList } from "../domain"

const nodeShape = Joi.object<Node>({
  nodeId: Joi.string().required(),
  name: Joi.string().required(),
  parentId: Joi.string().default(null),
  previousSiblingId: Joi.string().default(null),
})

const nodeListShape = Joi.array<NodeList>().has(nodeShape)

export const parseJsonStringToNodes = (rawString: string): NodeList | Error => {
  const parsed = JSON.parse(rawString)
  const validationResult = nodeListShape.validate(parsed)

  if (validationResult.error) return validationResult.error

  return validationResult.value
}

export const parseFileNameToNodes = (fileName: string): NodeList | Error => {
  let fileContent: string
  try {
    fileContent = fs.readFileSync(fileName, "utf8")
  } catch (err: unknown) {
    if (err instanceof Error) return err
    return new Error(`Something unexpected happened: ${JSON.stringify(err)}`)
  }
  return parseJsonStringToNodes(fileContent)
}
