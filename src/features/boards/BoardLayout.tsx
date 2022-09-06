import { Button, Container, createStyles, Paper, Title } from '@mantine/core'
import { useState, useRef, useCallback, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
  DragOverEvent,
  UniqueIdentifier,
  CollisionDetection,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { coordinateGetter } from './util/coordinateGetter'
import DragDropList from './DragDropList'
import NavBreadcrumbs from '../common/Breadcrumbs'

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  title: {
    margin: '.5em 0',
    color: theme.colors.gray[8],
  },
  boards: {
    display: 'flex',
    flexDirection: 'column',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'row',
    },
  },
  board: {
    flex: '1 200px',
    background: theme.colors.gray[0],
    padding: '1em',
  },
  paper: {
    height: '100%',
  },
  sprintItems: {
    margin: '.5em 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
    },
  },
  sprintButton: {},
}))

function BoardLayout() {
  const data = [
    {
      position: 6,
      mass: 12.011,
      symbol: 'C',
      name: 'Carbon',
    },
    {
      position: 7,
      mass: 14.007,
      symbol: 'N',
      name: 'Nitrogen',
    },
    {
      position: 39,
      mass: 88.906,
      symbol: 'Y',
      name: 'Yttrium',
    },
    {
      position: 56,
      mass: 137.33,
      symbol: 'Ba',
      name: 'Barium',
    },
    {
      position: 58,
      mass: 140.12,
      symbol: 'Ce',
      name: 'Cerium',
    },
  ]
  const { classes } = useStyles()
  const [clonedItems, setClonedItems] = useState<Items | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  )
  const { setNodeRef: setTodoDroppableRef } = useDroppable({
    id: 'droppable-todo',
  })
  const { setNodeRef: setInProgressDroppableRef } = useDroppable({
    id: 'droppable-in-progress',
  })
  const { setNodeRef: setDoneDroppableRef } = useDroppable({
    id: 'droppable-done',
  })
  const TRASH_ID = 'void'
  const PLACEHOLDER_ID = 'placeholder'
  const empty: UniqueIdentifier[] = []
  const sortedItems = data.map((item) => item.name)
  type Items = Record<UniqueIdentifier, UniqueIdentifier[]>

  const [items, setItems] = useState<Items>({
    todo: [...sortedItems],
    inProgress: [],
    done: [],
  })
  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[]
  )

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)
  const isSortingContainer = activeId ? containers.includes(activeId) : false

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        })
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        if (overId === TRASH_ID) {
          // If the intersecting droppable is the trash, return early
          // Remove this if you're not using trashable functionality in your app
          return intersections
        }

        if (overId in items) {
          const containerItems = items[overId]

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id)
              ),
            })[0]?.id
          }
        }

        lastOverId.current = overId

        return [{ id: overId }]
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, items]
  )

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id
    }

    return Object.keys(items).find((key) => items[key].includes(id))
  }

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id)

    if (!container) {
      return -1
    }

    const index = items[container].indexOf(id)

    return index
  }

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems)
    }

    setActiveId(null)
    setClonedItems(null)
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [items])

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const overId = over?.id

    if (overId == null || overId === TRASH_ID || active.id in items) {
      return
    }

    const overContainer = findContainer(overId)
    const activeContainer = findContainer(active.id)

    if (!overContainer || !activeContainer) {
      return
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeItems = items[activeContainer]
        const overItems = items[overContainer]
        const overIndex = overItems.indexOf(overId)
        const activeIndex = activeItems.indexOf(active.id)

        let newIndex: number

        if (overId in items) {
          newIndex = overItems.length + 1
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height

          const modifier = isBelowOverItem ? 1 : 0

          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1
        }

        recentlyMovedToNewContainer.current = true

        return {
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (item) => item !== active.id
          ),
          [overContainer]: [
            ...items[overContainer].slice(0, newIndex),
            items[activeContainer][activeIndex],
            ...items[overContainer].slice(
              newIndex,
              items[overContainer].length
            ),
          ],
        }
      })
    }
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id in items && over?.id) {
      setContainers((currentContainers) => {
        const activeIndex = currentContainers.indexOf(active.id)
        const overIndex = currentContainers.indexOf(over.id)

        return arrayMove(currentContainers, activeIndex, overIndex)
      })
    }

    const activeContainer = findContainer(active.id)

    if (!activeContainer) {
      setActiveId(null)
      return
    }

    const overId = over?.id

    if (overId == null) {
      setActiveId(null)
      return
    }

    if (overId === TRASH_ID) {
      setItems((currentItems) => ({
        ...currentItems,
        [activeContainer]: currentItems[activeContainer].filter(
          (id) => id !== activeId
        ),
      }))
      setActiveId(null)
      return
    }

    if (overId === PLACEHOLDER_ID) {
      const newContainerId = getNextContainerId()

      unstable_batchedUpdates(() => {
        setContainers((containers) => [...containers, newContainerId])
        setItems((items) => ({
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (id) => id !== activeId
          ),
          [newContainerId]: [active.id],
        }))
        setActiveId(null)
      })
      return
    }

    const overContainer = findContainer(overId)

    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id)
      const overIndex = items[overContainer].indexOf(overId)

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          ),
        }))
      }
    }

    setActiveId(null)
  }

  return (
    <main className={classes.container}>
      <Container>
        <NavBreadcrumbs />
        <Title className={classes.title}>Project Title</Title>
        <div className={classes.sprintItems}>
          <Button variant="default" size="sm" className={classes.sprintButton}>
            Complete Sprint
          </Button>
        </div>

        <section className={classes.boards}>
          <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
            onDragStart={({ active }) => {
              setActiveId(active.id)
              setClonedItems(items)
            }}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            cancelDrop={cancelDrop}
            onDragCancel={onDragCancel}
            modifiers={modifiers}
          >
            <SortableContext
              items={[...containers, PLACEHOLDER_ID]}
              strategy={verticalListSortingStrategy}
            >
              <div className={classes.board}>
                <Paper shadow="sm" p="lg" className={classes.paper}>
                  <DroppableContainer
                    key={containerId}
                    id={containerId}
                    label={minimal ? undefined : `Column ${containerId}`}
                    columns={columns}
                    items={items[containerId]}
                    scrollable={scrollable}
                    style={containerStyle}
                    unstyled={minimal}
                    onRemove={() => handleRemove(containerId)}
                  >
                    <Title order={3} className={classes.title}>
                      Todo
                    </Title>
                    <div ref={setTodoDroppableRef}>
                      <DragDropList items={todo} />
                    </div>
                  </DroppableContainer>
                </Paper>
              </div>
              <div className={classes.board}>
                <Paper
                  shadow="sm"
                  p="lg"
                  className={classes.paper}
                  ref={setInProgressDroppableRef}
                >
                  <Title order={3} className={classes.title}>
                    In Progress
                  </Title>
                  <DragDropList items={inProgress} />
                </Paper>
              </div>
              <div className={classes.board}>
                <Paper
                  shadow="sm"
                  p="lg"
                  className={classes.paper}
                  ref={setDoneDroppableRef}
                >
                  <Title order={3} className={classes.title}>
                    Done
                  </Title>
                  <DragDropList items={done} />
                </Paper>
              </div>
            </SortableContext>
          </DndContext>
        </section>
      </Container>
    </main>
  )
}

export default BoardLayout
